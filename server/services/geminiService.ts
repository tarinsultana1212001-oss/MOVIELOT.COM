import { GoogleGenAI } from '@google/genai';
import { ALL_MEDIA_CATALOG } from '../data/curatedMovies';
import { AIChatMessage, AIRecommendationResult, RecommendationRequest, MediaItem } from '../../src/types';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }

  if (!geminiClient) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return geminiClient;
}

// Compact context of our media catalog so Gemini can anchor recommendations to real items
function getCatalogContext(): string {
  return ALL_MEDIA_CATALOG.slice(0, 30)
    .map((m) => `ID:${m.id} | Title:"${m.title}" | Type:${m.mediaType} | Year:${m.releaseDate.slice(0, 4)} | Genres:${m.genres.map((g) => g.name).join(',')} | Rating:${m.voteAverage}`)
    .join('\n');
}

/**
 * Intelligent local recommendation fallback engine when Gemini API is unavailable or unconfigured
 */
function generateSmartFallbackRecommendations(req: RecommendationRequest): AIRecommendationResult[] {
  const mood = (req.mood || '').toLowerCase();
  const genre = (req.genre || '').toLowerCase();
  const favoriteMovies = (req.favoriteMovies || '').toLowerCase();
  const decade = (req.decade || '').toLowerCase();
  const customPrompt = (req.freeformPrompt || '').toLowerCase();
  const runtime = (req.runtimePreference || '').toLowerCase();

  // Mood to genre mappings
  const moodGenreKeywords: Record<string, string[]> = {
    action: ['action', 'adventure', 'thriller'],
    adrenaline: ['action', 'adventure', 'thriller', 'crime'],
    'mind-bending': ['sci-fi', 'mystery', 'drama', 'thriller'],
    deep: ['drama', 'sci-fi', 'mystery'],
    'feel-good': ['comedy', 'animation', 'adventure', 'romance'],
    cozy: ['animation', 'comedy', 'romance', 'adventure'],
    dark: ['crime', 'drama', 'thriller', 'horror'],
    gritty: ['crime', 'drama', 'action', 'thriller'],
    epic: ['adventure', 'sci-fi', 'action', 'drama'],
    cinematic: ['sci-fi', 'adventure', 'drama'],
    romantic: ['romance', 'comedy', 'drama'],
    charming: ['romance', 'comedy', 'animation'],
    suspenseful: ['thriller', 'mystery', 'horror', 'crime'],
    tense: ['thriller', 'mystery', 'crime', 'drama'],
  };

  const keywords = [
    ...mood.split(/[\s,&]+/),
    ...genre.split(/[\s,&]+/),
    ...favoriteMovies.split(/[\s,]+/),
    ...customPrompt.split(/[\s,]+/)
  ].filter((w) => w.length > 2);

  // Score each catalog item
  const scored = ALL_MEDIA_CATALOG.map((item) => {
    let score = item.voteAverage * 1.5;
    const itemGenres = item.genres.map((g) => g.name.toLowerCase());
    const itemYear = parseInt(item.releaseDate.slice(0, 4), 10) || 2020;
    const itemRuntime = item.runtime || 120;

    // Mood match
    for (const [moodKey, relatedGenres] of Object.entries(moodGenreKeywords)) {
      if (mood.includes(moodKey)) {
        const matches = relatedGenres.some((rg) => itemGenres.includes(rg));
        if (matches) score += 6;
      }
    }

    // Genre match
    if (genre && genre !== 'any') {
      if (itemGenres.some((g) => g.includes(genre) || genre.includes(g))) {
        score += 8;
      }
    }

    // Decade match
    if (decade.includes('2020') && itemYear >= 2020) score += 5;
    if (decade.includes('2010') && itemYear >= 2010 && itemYear < 2020) score += 5;
    if (decade.includes('2000') && itemYear >= 2000 && itemYear < 2010) score += 5;
    if (decade.includes('1990') && itemYear >= 1990 && itemYear < 2000) score += 5;
    if (decade.includes('classic') && itemYear < 1990) score += 5;

    // Runtime preference
    if (runtime.includes('quick') && itemRuntime < 100) score += 3;
    if (runtime.includes('standard') && itemRuntime >= 95 && itemRuntime <= 130) score += 3;
    if (runtime.includes('epic') && itemRuntime > 130) score += 3;

    // Token keyword match in overview, title, cast, director
    const searchableText = `${item.title} ${item.tagline || ''} ${item.overview} ${item.director || ''} ${item.cast?.map((c) => c.name).join(' ') || ''}`.toLowerCase();
    for (const kw of keywords) {
      if (searchableText.includes(kw)) {
        score += 3;
      }
    }

    // Generate dynamic contextual reason
    let reason = '';
    if (mood.includes('mind') || mood.includes('deep')) {
      reason = `Matches your taste for intricate world-building and thought-provoking narrative depth with a stellar ${item.voteAverage.toFixed(1)}/10 community rating.`;
    } else if (mood.includes('adrenaline') || mood.includes('action')) {
      reason = `Delivers exhilarating pacing and premier cinematic craftsmanship in the ${item.genres[0]?.name || 'Action'} genre.`;
    } else if (mood.includes('feel') || mood.includes('cozy')) {
      reason = `A heartwarming, impeccably paced cinematic delight that delivers an uplifting and memorable viewing experience.`;
    } else if (mood.includes('dark') || mood.includes('gritty')) {
      reason = `A masterclass in atmospheric tension and complex characters, acclaimed for its uncompromising direction.`;
    } else if (mood.includes('suspense') || mood.includes('tense')) {
      reason = `A relentless, edge-of-your-seat thriller packed with brilliant performances and shocking turns.`;
    } else {
      reason = `Top-rated standout on MovieLot known for exceptional ${item.genres.map((g) => g.name).join(' & ')} storytelling directed by ${item.director || 'acclaimed filmmakers'}.`;
    }

    return {
      item,
      score,
      reason,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return top 5
  return scored.slice(0, 5).map(({ item, reason }) => ({
    title: item.title,
    year: item.releaseDate.slice(0, 4),
    rating: item.voteAverage,
    genre: item.genres.map((g) => g.name).join(', '),
    reason,
    matchedId: item.id,
    matchedMediaType: item.mediaType,
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
  }));
}

/**
 * Generate structured recommendations based on mood, genre, favorite movies, and preferences.
 */
export async function generateRecommendations(req: RecommendationRequest): Promise<AIRecommendationResult[]> {
  const ai = getGeminiClient();

  // If Gemini client is unavailable, use smart heuristic recommendation engine
  if (!ai) {
    return generateSmartFallbackRecommendations(req);
  }

  const prompt = `You are the MovieLot AI Recommendation Engine.
Analyze the user's viewing preferences and recommend 4 to 6 films or TV shows that perfectly fit their request.

User Preferences:
- Mood: ${req.mood || 'Any'}
- Genre: ${req.genre || 'Any'}
- Favorite Movies / Reference: ${req.favoriteMovies || 'None specified'}
- Preferred Decade / Era: ${req.decade || 'Any'}
- Language: ${req.language || 'Any'}
- Preferred Runtime: ${req.runtimePreference || 'Any'}
- Minimum Rating Preference: ${req.ratingPreference || 'Any'}
- Freeform Prompt: ${req.freeformPrompt || 'None'}

Here is a list of catalog items available on the platform that you can match or recommend:
${getCatalogContext()}

Requirements:
1. Provide thoughtful, well-reasoned recommendations.
2. If any of the recommendations match an item from the catalog list above, supply its exact "matchedId" and "matchedMediaType".
3. Return ONLY a valid JSON array of objects without Markdown code blocks or backticks.
Each object must follow this exact format:
{
  "title": "Movie or Show Title",
  "year": "2024",
  "rating": 8.4,
  "genre": "Sci-Fi / Drama",
  "reason": "Clear, exciting 1-2 sentence explanation of why this fits their exact request.",
  "matchedId": 693134,
  "matchedMediaType": "movie"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: 'You are an expert cinematic curator for MovieLot.com. Always output pure, valid JSON arrays.',
      },
    });

    const text = response.text || '[]';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(cleanJson) as AIRecommendationResult[];
    // Populate posters / backdrops if matched in catalog
    return parsed.map((rec) => {
      if (rec.matchedId) {
        const found = ALL_MEDIA_CATALOG.find((m) => m.id === rec.matchedId);
        if (found) {
          rec.posterPath = found.posterPath;
          rec.backdropPath = found.backdropPath;
          rec.matchedMediaType = found.mediaType;
        }
      }
      return rec;
    });
  } catch (err) {
    console.warn('Gemini API call encountered an issue, gracefully falling back to smart catalog curation:', err);
    return generateSmartFallbackRecommendations(req);
  }
}

/**
 * Intelligent chat fallback response when Gemini is unconfigured or rate limited
 */
function generateSmartChatFallback(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): AIChatMessage {
  const query = userMessage.toLowerCase();

  // Find relevant titles from catalog
  const matchingItems = ALL_MEDIA_CATALOG.filter((item) => {
    const searchString = `${item.title} ${item.overview} ${item.director || ''} ${item.genres.map((g) => g.name).join(' ')}`.toLowerCase();
    const words = query.split(/\s+/).filter((w) => w.length > 2);
    return words.some((w) => searchString.includes(w));
  });

  const selectedSuggestions = (matchingItems.length > 0 ? matchingItems : ALL_MEDIA_CATALOG).slice(0, 3);

  let responseText = '';
  if (query.includes('recommend') || query.includes('suggest') || query.includes('watch') || query.includes('movie') || query.includes('show')) {
    responseText = `Here are some standout titles from the MovieLot collection that I think you will love:\n\n` +
      selectedSuggestions.map((m) => `• **${m.title}** (${m.releaseDate.slice(0, 4)}) — Rated **${m.voteAverage.toFixed(1)}/10** · ${m.genres.map((g) => g.name).join(', ')}.\n  ${m.tagline || m.overview.slice(0, 120) + '...'}`).join('\n\n') +
      `\n\nWould you like to explore similar titles, or drill into a specific genre or director?`;
  } else if (query.includes('dune') || query.includes('sci-fi') || query.includes('space') || query.includes('future')) {
    const sciFi = ALL_MEDIA_CATALOG.filter((m) => m.genres.some((g) => g.name.toLowerCase().includes('sci-fi')));
    responseText = `Sci-fi and speculative cinema are in a golden era! In particular, Denis Villeneuve's **Dune: Part Two** and Christopher Nolan's visionary epics demonstrate what grand, immersive world-building can achieve on the big screen.\n\nHere are the top sci-fi experiences available to explore right now in the catalog:`;
  } else if (query.includes('horror') || query.includes('scary') || query.includes('thriller')) {
    responseText = `If you're craving atmospheric dread, psychological suspense, or edge-of-your-seat thrills, we have curated some of the highest-rated thrillers and mysteries on the platform.`;
  } else {
    responseText = `Welcome to MovieLot AI! I'm your cinematic concierge. Whether you're looking for curated film recommendations, deep-dive plot analysis, director retrospectives, or help deciding what to watch tonight, I'm here to help.`;
  }

  const suggestions = selectedSuggestions.map((s) => ({
    id: s.id,
    title: s.title,
    mediaType: s.mediaType,
    year: s.releaseDate.slice(0, 4),
    rating: s.voteAverage,
    posterPath: s.posterPath,
  }));

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role: 'assistant',
    content: responseText,
    timestamp: Date.now(),
    suggestedMovies: suggestions,
  };
}

/**
 * Handle AI Movie Assistant Conversation
 */
export async function chatWithAssistant(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<AIChatMessage> {
  const ai = getGeminiClient();

  if (!ai) {
    return generateSmartChatFallback(messages, userMessage);
  }

  const conversationHistory = messages
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'User' : 'MovieLot AI'}: ${m.content}`)
    .join('\n');

  const prompt = `You are MovieLot AI, the intelligent cinematic concierge and entertainment assistant for MovieLot.com.
You help users find movies & TV shows, compare titles, decipher complex plots (no spoilers unless requested), recommend hidden gems, and answer trivia.

MovieLot catalog context (titles available with full pages):
${getCatalogContext()}

Instructions:
1. Provide engaging, knowledgeable, and concise answers (2-3 paragraphs maximum).
2. When mentioning specific titles from the catalog, mention their release year and why they are noteworthy.
3. At the very end of your response, if you recommended any specific titles from the catalog above, provide a line formatted as:
[SUGGESTIONS: [{"id": 693134, "title": "Dune: Part Two", "mediaType": "movie", "year": "2024", "rating": 8.5}]]
If none match catalog, omit the [SUGGESTIONS] line.

Conversation History:
${conversationHistory}

User: ${userMessage}
MovieLot AI:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: 'You are MovieLot AI, an elite film and television guide. Be warm, articulate, and passionate about cinema.',
      },
    });

    const fullText = response.text || "I'm here to help you discover great movies and shows. What genre are you in the mood for?";
    
    let cleanContent = fullText;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let suggestedMovies: any[] = [];

    const suggestionMatch = fullText.match(/\[SUGGESTIONS:\s*(\[.*?\])\]/s);
    if (suggestionMatch && suggestionMatch[1]) {
      try {
        suggestedMovies = JSON.parse(suggestionMatch[1]);
        cleanContent = fullText.replace(suggestionMatch[0], '').trim();
        
        // enrich suggestions with posterPath from catalog
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        suggestedMovies = suggestedMovies.map((s: any) => {
          const item = ALL_MEDIA_CATALOG.find((m) => m.id === s.id || m.title.toLowerCase() === s.title.toLowerCase());
          if (item) {
            s.id = item.id;
            s.posterPath = item.posterPath;
            s.mediaType = item.mediaType;
          }
          return s;
        });
      } catch (e) {
        console.warn('Could not parse suggestions tag:', e);
      }
    }

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: cleanContent,
      timestamp: Date.now(),
      suggestedMovies: suggestedMovies.length > 0 ? suggestedMovies : undefined,
    };
  } catch (err) {
    console.warn('Gemini chat error, falling back gracefully:', err);
    return generateSmartChatFallback(messages, userMessage);
  }
}

