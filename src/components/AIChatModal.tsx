import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Trash2, Bot, User, Film, Tv, Star } from 'lucide-react';
import { AIChatMessage, MediaItem, MediaType } from '../types';
import { apiClient } from '../services/apiClient';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (item: MediaItem) => void;
}

const SUGGESTED_PROMPTS = [
  'Recommend a mind-bending sci-fi movie',
  'Movies like Interstellar and Dune',
  'Best crime thrillers for tonight',
  'What should I watch this weekend?',
  'Explain the ending of Inception'
];

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  onSelectMovie
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm MovieLot AI, your personal cinematic concierge. Tell me your mood, favorite director, or describe what you'd love to watch, and I'll find the perfect title for you.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setError(null);
    setInput('');

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await apiClient.sendAiChat(
        newHistory.map((m) => ({ role: m.role, content: m.content })),
        query
      );
      setMessages((prev) => [...prev, response]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'MovieLot AI is taking a short break. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Chat cleared! What genre, mood, or film would you like to explore next?",
        timestamp: Date.now()
      }
    ]);
    setError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="MovieLot AI Movie Assistant"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl h-[85vh] max-h-[700px] bg-[#10141d] rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/90 bg-[#0c0f16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-100 text-sm sm:text-base">MovieLot AI Assistant</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-zinc-400">Cinematic recommendations grounded in real titles</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClear}
              title="Clear conversation"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close assistant"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-black font-medium rounded-tr-sm shadow-md'
                    : 'bg-[#161c28] text-zinc-200 border border-zinc-800 rounded-tl-sm space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Grounded Movie Suggestions */}
                {m.suggestedMovies && m.suggestedMovies.length > 0 && (
                  <div className="pt-2 border-t border-zinc-700/60 mt-3 space-y-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                      Recommended Matches
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.suggestedMovies.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => {
                            onSelectMovie({
                              id: rec.id,
                              title: rec.title,
                              mediaType: rec.mediaType as MediaType,
                              overview: '',
                              posterPath: rec.posterPath || '',
                              backdropPath: '',
                              releaseDate: rec.year,
                              voteAverage: rec.rating,
                              genres: []
                            });
                            onClose();
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 cursor-pointer transition-all group"
                        >
                          {rec.posterPath ? (
                            <img
                              src={rec.posterPath}
                              alt={rec.title}
                              className="w-10 h-14 object-cover rounded-md shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500 shrink-0">
                              {rec.mediaType === 'tv' ? <Tv size={14} /> : <Film size={14} />}
                            </div>
                          )}
                          <div className="overflow-hidden flex-1">
                            <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 truncate">
                              {rec.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                              <span>{rec.year}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-amber-400">
                                <Star size={10} className="fill-current" />
                                {rec.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-1">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Bot size={15} />
              </div>
              <div className="bg-[#161c28] border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Curating recommendations...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => handleSend()}
                className="underline hover:text-white font-medium ml-2"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Quick Bar */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-zinc-850 bg-[#0d1118]/80 flex gap-2 overflow-x-auto no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-zinc-800/90 bg-[#0c0f16] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... 'What should I watch tonight?', 'Movies like Interstellar'"
            disabled={loading}
            className="flex-1 bg-zinc-900/90 border border-zinc-750 focus:border-amber-500 text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
