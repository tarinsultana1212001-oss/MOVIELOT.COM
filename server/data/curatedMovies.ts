import { Genre, MediaItem } from '../../src/types';

export const GENRES_LIST: Genre[] = [
  { id: 28, name: 'Action', slug: 'action', description: 'High-octane stunts, adrenaline-pumping sequences, and explosive spectacles.', backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000' },
  { id: 12, name: 'Adventure', slug: 'adventure', description: 'Epic quests, breathtaking landscapes, and journey into uncharted realms.', backdropUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000' },
  { id: 16, name: 'Animation', slug: 'animation', description: 'Stunning visual artistry, heartwarming tales, and boundless imaginative worlds.', backdropUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000' },
  { id: 35, name: 'Comedy', slug: 'comedy', description: 'Sharp wit, hilarious misadventures, and laugh-out-loud entertainment.', backdropUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1000' },
  { id: 80, name: 'Crime', slug: 'crime', description: 'Underworld syndicates, cunning heists, detective procedurals, and gritty investigations.', backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000' },
  { id: 18, name: 'Drama', slug: 'drama', description: 'Intense human emotion, complex moral dilemmas, and gripping character journeys.', backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000' },
  { id: 14, name: 'Fantasy', slug: 'fantasy', description: 'Mythical creatures, ancient prophecies, magic, and spellbinding kingdoms.', backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000' },
  { id: 27, name: 'Horror', slug: 'horror', description: 'Spine-chilling terror, paranormal suspense, and atmospheric dread.', backdropUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000' },
  { id: 9648, name: 'Mystery', slug: 'mystery', description: 'Cryptic enigmas, unexpected plot twists, and puzzling who-done-its.', backdropUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000' },
  { id: 878, name: 'Sci-Fi', slug: 'sci-fi', description: 'Futuristic technologies, cosmic frontiers, time travel, and speculative realities.', backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000' },
  { id: 53, name: 'Thriller', slug: 'thriller', description: 'Heart-stopping tension, psychological cat-and-mouse games, and shocking turns.', backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1000' },
  { id: 10749, name: 'Romance', slug: 'romance', description: 'Passionate encounters, heartfelt chemistry, and enduring relationships.', backdropUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000' }
];

export const CURATED_MOVIES: MediaItem[] = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.',
    posterPath: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
    mediaType: 'movie',
    releaseDate: '2024-03-01',
    voteAverage: 8.5,
    voteCount: 5200,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    runtime: 166,
    status: 'Released',
    director: 'Denis Villeneuve',
    productionCompanies: ['Legendary Pictures', 'Warner Bros. Entertainment'],
    cast: [
      { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profilePath: 'https://image.tmdb.org/t/p/w300/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { id: 2, name: 'Zendaya', character: 'Chani', profilePath: 'https://image.tmdb.org/t/p/w300/r3A7ev7QkjOGMcMeUlC0fZmQOoa.jpg' },
      { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica', profilePath: 'https://image.tmdb.org/t/p/w300/4n74Gz6e8oTj0H07GgN4mN2eK.jpg' },
      { id: 4, name: 'Javier Bardem', character: 'Stilgar', profilePath: 'https://image.tmdb.org/t/p/w300/g9z03jV7iF3t1Q2v0Yd.jpg' },
      { id: 5, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profilePath: 'https://image.tmdb.org/t/p/w300/2L2zC8u8Q5L1xN5c4Y0n0Q6w9Yv.jpg' }
    ],
    crew: [
      { id: 101, name: 'Denis Villeneuve', job: 'Director', department: 'Directing' },
      { id: 102, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' },
      { id: 103, name: 'Greig Fraser', job: 'Director of Photography', department: 'Camera' }
    ],
    trailers: [
      { id: 't1', key: 'Way9Dexny3w', name: 'Official Trailer 3', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 190000000,
    revenue: 714444358,
    language: 'English',
    country: 'United States'
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    tagline: 'The world forever changes.',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, examining the scientific breakthroughs, political controversies, and profound ethical consequences of unleashing the nuclear age.',
    posterPath: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    mediaType: 'movie',
    releaseDate: '2023-07-21',
    voteAverage: 8.4,
    voteCount: 8800,
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    runtime: 181,
    status: 'Released',
    director: 'Christopher Nolan',
    productionCompanies: ['Syncopy', 'Universal Pictures'],
    cast: [
      { id: 11, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profilePath: 'https://image.tmdb.org/t/p/w300/360RzOmsD329ahJ7vG5wXW0WvS.jpg' },
      { id: 12, name: 'Emily Blunt', character: 'Katherine "Kitty" Oppenheimer', profilePath: 'https://image.tmdb.org/t/p/w300/5kY90pUj8e0kF0G7vX2v.jpg' },
      { id: 13, name: 'Matt Damon', character: 'Leslie Groves', profilePath: 'https://image.tmdb.org/t/p/w300/elSlNg0W225e3W67qXG23o2wVw4.jpg' },
      { id: 14, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profilePath: 'https://image.tmdb.org/t/p/w300/5qHNjhtjMD4Ywh3ag093FeW7.jpg' },
      { id: 15, name: 'Florence Pugh', character: 'Jean Tatlock', profilePath: 'https://image.tmdb.org/t/p/w300/5r5g5Z6L4h1N9b4.jpg' }
    ],
    crew: [
      { id: 104, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
      { id: 105, name: 'Ludwig Göransson', job: 'Original Music Composer', department: 'Sound' },
      { id: 106, name: 'Hoyte van Hoytema', job: 'Director of Photography', department: 'Camera' }
    ],
    trailers: [
      { id: 't2', key: 'uYPbbksJxIg', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 100000000,
    revenue: 957000000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 157336,
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage to save humanity.',
    posterPath: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    mediaType: 'movie',
    releaseDate: '2014-11-05',
    voteAverage: 8.7,
    voteCount: 35000,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' }, { id: 12, name: 'Adventure' }],
    runtime: 169,
    status: 'Released',
    director: 'Christopher Nolan',
    productionCompanies: ['Paramount Pictures', 'Warner Bros. Pictures', 'Legendary Pictures', 'Syncopy'],
    cast: [
      { id: 21, name: 'Matthew McConaughey', character: 'Joseph Cooper', profilePath: 'https://image.tmdb.org/t/p/w300/sY2waQ0MQ7j1iuhY2.jpg' },
      { id: 22, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profilePath: 'https://image.tmdb.org/t/p/w300/tLpq5hB8fHkU6f4.jpg' },
      { id: 23, name: 'Jessica Chastain', character: 'Murphy "Murph" Cooper', profilePath: 'https://image.tmdb.org/t/p/w300/vGvU1ZgZ8o0kYp5.jpg' },
      { id: 24, name: 'Michael Caine', character: 'Professor John Brand', profilePath: 'https://image.tmdb.org/t/p/w300/b0oWp4.jpg' }
    ],
    crew: [
      { id: 104, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
      { id: 102, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' }
    ],
    trailers: [
      { id: 't3', key: 'zSWdZVtXT7E', name: 'Official Trailer 3', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 165000000,
    revenue: 773867216,
    language: 'English',
    country: 'United States'
  },
  {
    id: 27205,
    title: 'Inception',
    originalTitle: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    overview: 'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    posterPath: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    mediaType: 'movie',
    releaseDate: '2010-07-15',
    voteAverage: 8.4,
    voteCount: 36000,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    runtime: 148,
    status: 'Released',
    director: 'Christopher Nolan',
    productionCompanies: ['Warner Bros. Pictures', 'Syncopy', 'Legendary Pictures'],
    cast: [
      { id: 31, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profilePath: 'https://image.tmdb.org/t/p/w300/wo2hxAzEAhsy9WXZ2.jpg' },
      { id: 32, name: 'Joseph Gordon-Levitt', character: 'Arthur', profilePath: 'https://image.tmdb.org/t/p/w300/dG0H1uFkY6m8tB.jpg' },
      { id: 33, name: 'Elliot Page', character: 'Ariadne', profilePath: 'https://image.tmdb.org/t/p/w300/tp1nL01k.jpg' },
      { id: 34, name: 'Tom Hardy', character: 'Eames', profilePath: 'https://image.tmdb.org/t/p/w300/yVGF93v.jpg' },
      { id: 35, name: 'Ken Watanabe', character: 'Mr. Saito', profilePath: 'https://image.tmdb.org/t/p/w300/wata.jpg' }
    ],
    crew: [
      { id: 104, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
      { id: 102, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' }
    ],
    trailers: [
      { id: 't4', key: 'YoHD9XEInc0', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 160000000,
    revenue: 836836967,
    language: 'English',
    country: 'United States'
  },
  {
    id: 155,
    title: 'The Dark Knight',
    originalTitle: 'The Dark Knight',
    tagline: 'Why so serious?',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    posterPath: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSPoYqA0P.jpg',
    mediaType: 'movie',
    releaseDate: '2008-07-16',
    voteAverage: 8.5,
    voteCount: 32000,
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    runtime: 152,
    status: 'Released',
    director: 'Christopher Nolan',
    productionCompanies: ['DC Comics', 'Legendary Pictures', 'Syncopy', 'Warner Bros. Pictures'],
    cast: [
      { id: 41, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profilePath: 'https://image.tmdb.org/t/p/w300/bale.jpg' },
      { id: 42, name: 'Heath Ledger', character: 'Joker', profilePath: 'https://image.tmdb.org/t/p/w300/ledger.jpg' },
      { id: 43, name: 'Aaron Eckhart', character: 'Harvey Dent / Two-Face', profilePath: 'https://image.tmdb.org/t/p/w300/eckhart.jpg' },
      { id: 44, name: 'Gary Oldman', character: 'James Gordon', profilePath: 'https://image.tmdb.org/t/p/w300/oldman.jpg' }
    ],
    crew: [
      { id: 104, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
      { id: 102, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' }
    ],
    trailers: [
      { id: 't5', key: 'EXeTwQWrcwY', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 185000000,
    revenue: 1004558444,
    language: 'English',
    country: 'United States'
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It’s how you wear the mask that matters.',
    overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders.',
    posterPath: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    mediaType: 'movie',
    releaseDate: '2023-05-31',
    voteAverage: 8.4,
    voteCount: 6500,
    genres: [{ id: 16, name: 'Animation' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 140,
    status: 'Released',
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    productionCompanies: ['Sony Pictures Animation', 'Marvel Entertainment', 'Columbia Pictures'],
    cast: [
      { id: 51, name: 'Shameik Moore', character: 'Miles Morales / Spider-Man', profilePath: 'https://image.tmdb.org/t/p/w300/moore.jpg' },
      { id: 52, name: 'Hailee Steinfeld', character: 'Gwen Stacy / Spider-Woman', profilePath: 'https://image.tmdb.org/t/p/w300/steinfeld.jpg' },
      { id: 53, name: 'Oscar Isaac', character: 'Miguel O\'Hara / Spider-Man 2099', profilePath: 'https://image.tmdb.org/t/p/w300/isaac.jpg' }
    ],
    crew: [
      { id: 110, name: 'Phil Lord', job: 'Producer', department: 'Production' },
      { id: 111, name: 'Christopher Miller', job: 'Producer', department: 'Production' }
    ],
    trailers: [
      { id: 't6', key: 'cqGjhVJWtEg', name: 'Official Trailer 2', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 100000000,
    revenue: 690516673,
    language: 'English',
    country: 'United States'
  },
  {
    id: 545611,
    title: 'Everything Everywhere All at Once',
    originalTitle: 'Everything Everywhere All at Once',
    tagline: 'The universe is so much bigger than you realize.',
    overview: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what’s important to her by connecting with the lives she could have led in other universes.',
    posterPath: 'https://image.tmdb.org/t/p/w780/w3LxiVYSTOxGlpNOoh12tiitnsU.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/70Rm9mwhszZaHGSDcqGhOzEvmuV.jpg',
    mediaType: 'movie',
    releaseDate: '2022-03-24',
    voteAverage: 8.0,
    voteCount: 6100,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 139,
    status: 'Released',
    director: 'Daniel Kwan, Daniel Scheinert',
    productionCompanies: ['A24', 'AGBO'],
    cast: [
      { id: 61, name: 'Michelle Yeoh', character: 'Evelyn Wang', profilePath: 'https://image.tmdb.org/t/p/w300/yeoh.jpg' },
      { id: 62, name: 'Ke Huy Quan', character: 'Waymond Wang', profilePath: 'https://image.tmdb.org/t/p/w300/quan.jpg' },
      { id: 63, name: 'Stephanie Hsu', character: 'Joy Wang / Jobu Tupaki', profilePath: 'https://image.tmdb.org/t/p/w300/hsu.jpg' },
      { id: 64, name: 'Jamie Lee Curtis', character: 'Deirdre Beaubeirdre', profilePath: 'https://image.tmdb.org/t/p/w300/curtis.jpg' }
    ],
    trailers: [
      { id: 't7', key: 'wxN1T1uxQ2g', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 25000000,
    revenue: 143411132,
    language: 'English',
    country: 'United States'
  },
  {
    id: 496243,
    title: 'Parasite',
    originalTitle: '기생충',
    tagline: 'Act like you own the place.',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    posterPath: 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    mediaType: 'movie',
    releaseDate: '2019-05-30',
    voteAverage: 8.5,
    voteCount: 18000,
    genres: [{ id: 35, name: 'Comedy' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    runtime: 133,
    status: 'Released',
    director: 'Bong Joon-ho',
    productionCompanies: ['Barunson E&A', 'CJ Entertainment'],
    cast: [
      { id: 71, name: 'Song Kang-ho', character: 'Kim Ki-taek', profilePath: 'https://image.tmdb.org/t/p/w300/song.jpg' },
      { id: 72, name: 'Lee Sun-kyun', character: 'Park Dong-ik', profilePath: 'https://image.tmdb.org/t/p/w300/lee.jpg' },
      { id: 73, name: 'Cho Yeo-jeong', character: 'Choi Yeon-gyo', profilePath: 'https://image.tmdb.org/t/p/w300/cho.jpg' },
      { id: 74, name: 'Choi Woo-shik', character: 'Kim Ki-woo', profilePath: 'https://image.tmdb.org/t/p/w300/choi.jpg' }
    ],
    trailers: [
      { id: 't8', key: '5xH0R_fx44c', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 11400000,
    revenue: 263100000,
    language: 'Korean',
    country: 'South Korea'
  },
  {
    id: 335984,
    title: 'Blade Runner 2049',
    originalTitle: 'Blade Runner 2049',
    tagline: 'The key to the future is finally unearthed.',
    overview: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. K\'s discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.',
    posterPath: 'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/ilRyAZwN3SKgBAP9qbtmfs141N1.jpg',
    mediaType: 'movie',
    releaseDate: '2017-10-04',
    voteAverage: 8.0,
    voteCount: 13500,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' }, { id: 9648, name: 'Mystery' }],
    runtime: 164,
    status: 'Released',
    director: 'Denis Villeneuve',
    productionCompanies: ['Alcon Entertainment', 'Columbia Pictures', 'Scott Free Productions', 'Torridon Films'],
    cast: [
      { id: 81, name: 'Ryan Gosling', character: 'Officer K', profilePath: 'https://image.tmdb.org/t/p/w300/gosling.jpg' },
      { id: 82, name: 'Harrison Ford', character: 'Rick Deckard', profilePath: 'https://image.tmdb.org/t/p/w300/ford.jpg' },
      { id: 83, name: 'Ana de Armas', character: 'Joi', profilePath: 'https://image.tmdb.org/t/p/w300/armas.jpg' }
    ],
    trailers: [
      { id: 't9', key: 'gCcx85zbxz4', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 150000000,
    revenue: 267500000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 939243,
    title: 'Sonic the Hedgehog 3',
    originalTitle: 'Sonic the Hedgehog 3',
    tagline: 'Try to keep up.',
    overview: 'Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched in every way, Team Sonic must seek an unlikely alliance in hopes of stopping Shadow and protecting the planet.',
    posterPath: 'https://image.tmdb.org/t/p/w780/d8Ryb88unJZ5uyv7PIKnzcQTW3g.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/zOpe0e7gX9YuJv887oPOGQzLwbp.jpg',
    mediaType: 'movie',
    releaseDate: '2024-12-20',
    voteAverage: 7.8,
    voteCount: 2200,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 110,
    status: 'Released',
    director: 'Jeff Fowler',
    productionCompanies: ['Paramount Pictures', 'Original Film', 'Sega Sammy Group'],
    cast: [
      { id: 91, name: 'Ben Schwartz', character: 'Sonic the Hedgehog (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/schwartz.jpg' },
      { id: 92, name: 'Jim Carrey', character: 'Dr. Ivo Robotnik / Gerald Robotnik', profilePath: 'https://image.tmdb.org/t/p/w300/carrey.jpg' },
      { id: 93, name: 'Keanu Reeves', character: 'Shadow the Hedgehog (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/reeves.jpg' }
    ],
    trailers: [
      { id: 't10', key: 'qSu6i2iFMO0', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 122000000,
    revenue: 490000000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 533535,
    title: 'Deadpool & Wolverine',
    originalTitle: 'Deadpool & Wolverine',
    tagline: 'Everyone deserves a happy ending.',
    overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    posterPath: 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB12RRIZ6.jpg',
    mediaType: 'movie',
    releaseDate: '2024-07-24',
    voteAverage: 7.7,
    voteCount: 6100,
    genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 128,
    status: 'Released',
    director: 'Shawn Levy',
    productionCompanies: ['Marvel Studios', 'Maximum Effort', '21 Laps Entertainment'],
    cast: [
      { id: 121, name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', profilePath: 'https://image.tmdb.org/t/p/w300/reynolds.jpg' },
      { id: 122, name: 'Hugh Jackman', character: 'Logan / Wolverine', profilePath: 'https://image.tmdb.org/t/p/w300/jackman.jpg' },
      { id: 123, name: 'Emma Corrin', character: 'Cassandra Nova', profilePath: 'https://image.tmdb.org/t/p/w300/corrin.jpg' }
    ],
    trailers: [
      { id: 't11', key: '73_1biulkYk', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 200000000,
    revenue: 1338000000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 1022789,
    title: 'Inside Out 2',
    originalTitle: 'Inside Out 2',
    tagline: 'Make room for new emotions.',
    overview: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren’t sure how to feel when Anxiety shows up. And it looks like she’s not alone.',
    posterPath: 'https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/xg270vgDCu42H39N6gL2xTqa30.jpg',
    mediaType: 'movie',
    releaseDate: '2024-06-12',
    voteAverage: 7.6,
    voteCount: 5400,
    genres: [{ id: 16, name: 'Animation' }, { id: 10751, name: 'Family' }, { id: 35, name: 'Comedy' }, { id: 12, name: 'Adventure' }],
    runtime: 96,
    status: 'Released',
    director: 'Kelsey Mann',
    productionCompanies: ['Walt Disney Pictures', 'Pixar'],
    cast: [
      { id: 131, name: 'Amy Poehler', character: 'Joy (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/poehler.jpg' },
      { id: 132, name: 'Maya Hawke', character: 'Anxiety (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/hawke.jpg' },
      { id: 133, name: 'Kensington Tallman', character: 'Riley Andersen (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/tallman.jpg' }
    ],
    trailers: [
      { id: 't12', key: 'LEjhY15eCx0', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 200000000,
    revenue: 1698000000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 1184918,
    title: 'The Wild Robot',
    originalTitle: 'The Wild Robot',
    tagline: 'Discover your true nature.',
    overview: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island\'s animals and cares for an orphaned baby goose.',
    posterPath: 'https://image.tmdb.org/t/p/w780/wTnV3PCVW5O92JMrFvvrRil39io.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/417tYZ4XUyJrtyZXj7HSD0Zapkr.jpg',
    mediaType: 'movie',
    releaseDate: '2024-09-20',
    voteAverage: 8.4,
    voteCount: 4200,
    genres: [{ id: 16, name: 'Animation' }, { id: 878, name: 'Sci-Fi' }, { id: 10751, name: 'Family' }, { id: 12, name: 'Adventure' }],
    runtime: 102,
    status: 'Released',
    director: 'Chris Sanders',
    productionCompanies: ['DreamWorks Animation', 'Universal Pictures'],
    cast: [
      { id: 141, name: 'Lupita Nyong\'o', character: 'Roz (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/nyongo.jpg' },
      { id: 142, name: 'Pedro Pascal', character: 'Fink (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/pascal.jpg' },
      { id: 143, name: 'Kit Connor', character: 'Brightbill (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/connor.jpg' }
    ],
    trailers: [
      { id: 't13', key: '67vbA5ZJb3E', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 78000000,
    revenue: 330000000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 558449,
    title: 'Gladiator II',
    originalTitle: 'Gladiator II',
    tagline: 'Prepare to be entertained.',
    overview: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. With rage in his heart and the future of the Empire at stake, Lucius must look to his past to find strength.',
    posterPath: 'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnEx7vA4949nuo8.jpg',
    mediaType: 'movie',
    releaseDate: '2024-11-13',
    voteAverage: 6.8,
    voteCount: 2600,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }],
    runtime: 148,
    status: 'Released',
    director: 'Ridley Scott',
    productionCompanies: ['Paramount Pictures', 'Scott Free Productions'],
    cast: [
      { id: 151, name: 'Paul Mescal', character: 'Lucius Verus', profilePath: 'https://image.tmdb.org/t/p/w300/mescal.jpg' },
      { id: 152, name: 'Pedro Pascal', character: 'General Marcus Acacius', profilePath: 'https://image.tmdb.org/t/p/w300/pascal.jpg' },
      { id: 153, name: 'Denzel Washington', character: 'Macrinus', profilePath: 'https://image.tmdb.org/t/p/w300/washington.jpg' }
    ],
    trailers: [
      { id: 't14', key: '4rgYUipGJNo', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 250000000,
    revenue: 462000000,
    language: 'English',
    country: 'United States'
  },
  {
    id: 792307,
    title: 'Poor Things',
    originalTitle: 'Poor Things',
    tagline: 'She\'s like nothing you\'ve ever seen.',
    overview: 'Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents. Free from the prejudices of her times, she grows steadfast in her purpose to stand for equality and liberation.',
    posterPath: 'https://image.tmdb.org/t/p/w780/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/bQS43HSLZzMjZkcHJz4fS9fW0vM.jpg',
    mediaType: 'movie',
    releaseDate: '2023-12-07',
    voteAverage: 7.7,
    voteCount: 4200,
    genres: [{ id: 35, name: 'Comedy' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 141,
    status: 'Released',
    director: 'Yorgos Lanthimos',
    productionCompanies: ['Searchlight Pictures', 'Film4', 'Element Pictures'],
    cast: [
      { id: 161, name: 'Emma Stone', character: 'Bella Baxter', profilePath: 'https://image.tmdb.org/t/p/w300/stone.jpg' },
      { id: 162, name: 'Mark Ruffalo', character: 'Duncan Wedderburn', profilePath: 'https://image.tmdb.org/t/p/w300/ruffalo.jpg' },
      { id: 163, name: 'Willem Dafoe', character: 'Dr. Godwin Baxter', profilePath: 'https://image.tmdb.org/t/p/w300/dafoe.jpg' }
    ],
    trailers: [
      { id: 't15', key: 'RlbR5N6veqw', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    budget: 35000000,
    revenue: 117600000,
    language: 'English',
    country: 'United Kingdom'
  }
];

export const CURATED_TV_SHOWS: MediaItem[] = [
  {
    id: 66732,
    title: 'Stranger Things',
    originalTitle: 'Stranger Things',
    tagline: 'Every ending has a beginning.',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    posterPath: 'https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    mediaType: 'tv',
    releaseDate: '2016-07-15',
    voteAverage: 8.6,
    voteCount: 17200,
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }, { id: 9648, name: 'Mystery' }],
    runtime: 50,
    seasonsCount: 4,
    episodesCount: 34,
    status: 'Returning Series',
    creators: ['The Duffer Brothers'],
    cast: [
      { id: 201, name: 'Millie Bobby Brown', character: 'Eleven', profilePath: 'https://image.tmdb.org/t/p/w300/brown.jpg' },
      { id: 202, name: 'Finn Wolfhard', character: 'Mike Wheeler', profilePath: 'https://image.tmdb.org/t/p/w300/wolfhard.jpg' },
      { id: 203, name: 'David Harbour', character: 'Jim Hopper', profilePath: 'https://image.tmdb.org/t/p/w300/harbour.jpg' },
      { id: 204, name: 'Winona Ryder', character: 'Joyce Byers', profilePath: 'https://image.tmdb.org/t/p/w300/ryder.jpg' }
    ],
    trailers: [
      { id: 'tt1', key: 'b9EkMc79ZSU', name: 'Stranger Things Season 4 Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    seasons: [
      {
        id: 77121,
        seasonNumber: 1,
        name: 'Season 1',
        overview: 'A young boy disappears into thin air in the peaceful Indiana town of Hawkins.',
        episodeCount: 8,
        posterPath: 'https://image.tmdb.org/t/p/w500/rbBUbI12i0U4A4oH1VvO0w5.jpg',
        episodes: [
          { id: 101, seasonNumber: 1, episodeNumber: 1, name: 'Chapter One: The Vanishing of Will Byers', overview: 'On his way home from a friend\'s house, young Will sees something terrifying. Nearby, a secret sinister experiment breaks free.', runtime: 48, voteAverage: 8.5 },
          { id: 102, seasonNumber: 1, episodeNumber: 2, name: 'Chapter Two: The Weirdo on Maple Street', overview: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce.', runtime: 55, voteAverage: 8.6 },
          { id: 103, seasonNumber: 1, episodeNumber: 3, name: 'Chapter Three: Holly, Jolly', overview: 'An increasingly concerned Joyce suspects Will is trying to communicate with her through Christmas lights.', runtime: 51, voteAverage: 8.8 },
          { id: 104, seasonNumber: 1, episodeNumber: 4, name: 'Chapter Four: The Body', overview: 'Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover.', runtime: 50, voteAverage: 8.9 }
        ]
      },
      {
        id: 77122,
        seasonNumber: 4,
        name: 'Season 4',
        overview: 'Darkness returns to Hawkins just in time for spring break, igniting fresh terror and the greatest threat yet: Vecna.',
        episodeCount: 9,
        posterPath: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        episodes: [
          { id: 401, seasonNumber: 4, episodeNumber: 1, name: 'Chapter One: The Hellfire Club', overview: 'El struggles to fit in at high school in California. Back in Hawkins, the high school D&D squad searches for a sub.', runtime: 76, voteAverage: 8.8 },
          { id: 404, seasonNumber: 4, episodeNumber: 4, name: 'Chapter Four: Dear Billy', overview: 'Max is in grave danger and time is running out. A patient at Pennhurst asylum holds vital answers.', runtime: 78, voteAverage: 9.6 }
        ]
      }
    ],
    language: 'English',
    country: 'United States'
  },
  {
    id: 94605,
    title: 'Arcane',
    originalTitle: 'Arcane',
    tagline: 'Every legend has a beginning.',
    overview: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.',
    posterPath: 'https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn397rWW2vvg.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/q8eejuyEZPtJezcqTX5sq48ekao.jpg',
    mediaType: 'tv',
    releaseDate: '2021-11-06',
    voteAverage: 8.8,
    voteCount: 4100,
    genres: [{ id: 16, name: 'Animation' }, { id: 878, name: 'Sci-Fi' }, { id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
    runtime: 42,
    seasonsCount: 2,
    episodesCount: 18,
    status: 'Ended',
    creators: ['Christian Linke', 'Alex Yee'],
    cast: [
      { id: 211, name: 'Hailee Steinfeld', character: 'Vi (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/steinfeld.jpg' },
      { id: 212, name: 'Ella Purnell', character: 'Jinx (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/purnell.jpg' },
      { id: 213, name: 'Kevin Alejandro', character: 'Jayce Talis (voice)', profilePath: 'https://image.tmdb.org/t/p/w300/alejandro.jpg' }
    ],
    trailers: [
      { id: 'tt2', key: 'fXmAurh012s', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    seasons: [
      {
        id: 134187,
        seasonNumber: 1,
        name: 'Season 1',
        overview: 'Two sisters find themselves on opposite sides of a brewing conflict in the utopian city of Piltover and its oppressed underworld.',
        episodeCount: 9,
        episodes: [
          { id: 111, seasonNumber: 1, episodeNumber: 1, name: 'Welcome to the Playground', overview: 'Orphaned sisters Vi and Powder cause unintended mayhem when they rob an inventor\'s penthouse in top-side Piltover.', runtime: 43, voteAverage: 8.9 },
          { id: 112, seasonNumber: 1, episodeNumber: 3, name: 'The Base Violence Necessary for Change', overview: 'An alliance unravels into an explosion of grief and devastating transformation in the Zaun factory.', runtime: 44, voteAverage: 9.6 }
        ]
      }
    ],
    language: 'English',
    country: 'United States'
  },
  {
    id: 100088,
    title: 'The Last of Us',
    originalTitle: 'The Last of Us',
    tagline: 'When you\'re lost in the darkness, look for the light.',
    overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both must traverse the U.S. and depend on each other for survival.',
    posterPath: 'https://image.tmdb.org/t/p/w780/uKvVjHNqB5VmOrdxqAt2V7JMrHG.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    mediaType: 'tv',
    releaseDate: '2023-01-15',
    voteAverage: 8.6,
    voteCount: 5100,
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }, { id: 10759, name: 'Action & Adventure' }],
    runtime: 55,
    seasonsCount: 2,
    episodesCount: 16,
    status: 'Returning Series',
    creators: ['Craig Mazin', 'Neil Druckmann'],
    cast: [
      { id: 221, name: 'Pedro Pascal', character: 'Joel Miller', profilePath: 'https://image.tmdb.org/t/p/w300/pascal.jpg' },
      { id: 222, name: 'Bella Ramsey', character: 'Ellie Williams', profilePath: 'https://image.tmdb.org/t/p/w300/ramsey.jpg' },
      { id: 223, name: 'Gabriel Luna', character: 'Tommy Miller', profilePath: 'https://image.tmdb.org/t/p/w300/luna.jpg' }
    ],
    trailers: [
      { id: 'tt3', key: 'uLtkt8BonwM', name: 'Official Teaser Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    seasons: [
      {
        id: 144571,
        seasonNumber: 1,
        name: 'Season 1',
        overview: 'Joel and Ellie brave a post-pandemic America infested with mutated infected and ruthless survivor militias.',
        episodeCount: 9,
        episodes: [
          { id: 201, seasonNumber: 1, episodeNumber: 1, name: 'When You\'re Lost in the Darkness', overview: 'Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with a mission that could change everything.', runtime: 81, voteAverage: 8.9 },
          { id: 203, seasonNumber: 1, episodeNumber: 3, name: 'Long, Long Time', overview: 'When a stranger approaches his compound, survivalist Bill forges an unlikely, deeply moving connection with Frank.', runtime: 75, voteAverage: 9.7 }
        ]
      }
    ],
    language: 'English',
    country: 'United States'
  },
  {
    id: 126308,
    title: 'Shōgun',
    originalTitle: 'Shōgun',
    tagline: 'A battle of empires, honor, and destiny.',
    overview: 'When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power and devastate his formidable enemies in 17th century feudal Japan.',
    posterPath: 'https://image.tmdb.org/t/p/w780/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
    mediaType: 'tv',
    releaseDate: '2024-02-27',
    voteAverage: 8.5,
    voteCount: 1500,
    genres: [{ id: 18, name: 'Drama' }, { id: 10768, name: 'War & Politics' }],
    runtime: 58,
    seasonsCount: 1,
    episodesCount: 10,
    status: 'Renewed',
    creators: ['Rachel Kondo', 'Justin Marks'],
    cast: [
      { id: 231, name: 'Hiroyuki Sanada', character: 'Lord Yoshii Toranaga', profilePath: 'https://image.tmdb.org/t/p/w300/sanada.jpg' },
      { id: 232, name: 'Cosmo Jarvis', character: 'John Blackthorne', profilePath: 'https://image.tmdb.org/t/p/w300/jarvis.jpg' },
      { id: 233, name: 'Anna Sawai', character: 'Toda Mariko', profilePath: 'https://image.tmdb.org/t/p/w300/sawai.jpg' }
    ],
    trailers: [
      { id: 'tt4', key: 'yRfQWY4apVQ', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    seasons: [
      {
        id: 198000,
        seasonNumber: 1,
        name: 'Season 1',
        overview: 'Civil war brews across the Regent Council of Japan.',
        episodeCount: 10,
        episodes: [
          { id: 301, seasonNumber: 1, episodeNumber: 1, name: 'Chapter One: Anjin', overview: 'Destinies converge in Japan after a barbarian ship washes ashore in Toranaga\'s territory.', runtime: 68, voteAverage: 8.8 },
          { id: 309, seasonNumber: 1, episodeNumber: 9, name: 'Chapter Nine: Crimson Sky', overview: 'Mariko arrives in Osaka for the fight of her life as Toranaga executes his master stroke.', runtime: 60, voteAverage: 9.6 }
        ]
      }
    ],
    language: 'Japanese',
    country: 'United States'
  },
  {
    id: 114479,
    title: 'Severance',
    originalTitle: 'Severance',
    tagline: 'Please do not attempt to remember this.',
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    posterPath: 'https://image.tmdb.org/t/p/w780/jfZ0f74Wq7nSdf7J15Z2R108hP3.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/9n5L7G5hC0j2J8Zg2k5C0Y0Lp8.jpg',
    mediaType: 'tv',
    releaseDate: '2022-02-17',
    voteAverage: 8.4,
    voteCount: 2200,
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }, { id: 9648, name: 'Mystery' }],
    runtime: 52,
    seasonsCount: 2,
    episodesCount: 19,
    status: 'Returning Series',
    creators: ['Dan Erickson'],
    cast: [
      { id: 241, name: 'Adam Scott', character: 'Mark Scout', profilePath: 'https://image.tmdb.org/t/p/w300/scott.jpg' },
      { id: 242, name: 'Zach Cherry', character: 'Dylan George', profilePath: 'https://image.tmdb.org/t/p/w300/cherry.jpg' },
      { id: 243, name: 'Britt Lower', character: 'Helly Riggs', profilePath: 'https://image.tmdb.org/t/p/w300/lower.jpg' },
      { id: 244, name: 'Patricia Arquette', character: 'Harmony Cobel', profilePath: 'https://image.tmdb.org/t/p/w300/arquette.jpg' }
    ],
    trailers: [
      { id: 'tt5', key: 'xEQP4VVuyrY', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    seasons: [
      {
        id: 167822,
        seasonNumber: 1,
        name: 'Season 1',
        overview: 'Inside Lumon Industries\' severed floor, Macrodata Refinement uncovers sinister corporate anomalies.',
        episodeCount: 9,
        episodes: [
          { id: 501, seasonNumber: 1, episodeNumber: 1, name: 'Good News About Hell', overview: 'Mark Scout receives a promotion at Lumon Industries, whose employees have undergone a surgical procedure separating work and personal memories.', runtime: 57, voteAverage: 8.4 },
          { id: 509, seasonNumber: 1, episodeNumber: 9, name: 'The We We Are', overview: 'The severance team uses the Overtime Contingency to awaken on the outside in a breathtaking season finale.', runtime: 40, voteAverage: 9.8 }
        ]
      }
    ],
    language: 'English',
    country: 'United States'
  },
  {
    id: 1399,
    title: 'Game of Thrones',
    originalTitle: 'Game of Thrones',
    tagline: 'Winter is Coming.',
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.',
    posterPath: 'https://image.tmdb.org/t/p/w780/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    mediaType: 'tv',
    releaseDate: '2011-04-17',
    voteAverage: 8.4,
    voteCount: 24000,
    genres: [{ id: 18, name: 'Drama' }, { id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 10759, name: 'Action & Adventure' }],
    runtime: 58,
    seasonsCount: 8,
    episodesCount: 73,
    status: 'Ended',
    creators: ['David Benioff', 'D. B. Weiss'],
    cast: [
      { id: 251, name: 'Emilia Clarke', character: 'Daenerys Targaryen', profilePath: 'https://image.tmdb.org/t/p/w300/clarke.jpg' },
      { id: 252, name: 'Kit Harington', character: 'Jon Snow', profilePath: 'https://image.tmdb.org/t/p/w300/harington.jpg' },
      { id: 253, name: 'Peter Dinklage', character: 'Tyrion Lannister', profilePath: 'https://image.tmdb.org/t/p/w300/dinklage.jpg' },
      { id: 254, name: 'Lena Headey', character: 'Cersei Lannister', profilePath: 'https://image.tmdb.org/t/p/w300/headey.jpg' }
    ],
    trailers: [
      { id: 'tt6', key: 'KPLWWIOCOOQ', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    language: 'English',
    country: 'United States'
  },
  {
    id: 1396,
    title: 'Breaking Bad',
    originalTitle: 'Breaking Bad',
    tagline: 'All Hail the King.',
    overview: 'Walter White, a New Mexico chemistry teacher diagnosed with terminal lung cancer, teams up with a former student, Jesse Pinkman, to secure his family\'s future by manufacturing and selling crystal meth.',
    posterPath: 'https://image.tmdb.org/t/p/w780/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/9faGSFi5jam6pDWGNd0p8J25jjd.jpg',
    mediaType: 'tv',
    releaseDate: '2008-01-20',
    voteAverage: 8.9,
    voteCount: 14500,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    runtime: 47,
    seasonsCount: 5,
    episodesCount: 62,
    status: 'Ended',
    creators: ['Vince Gilligan'],
    cast: [
      { id: 261, name: 'Bryan Cranston', character: 'Walter White', profilePath: 'https://image.tmdb.org/t/p/w300/cranston.jpg' },
      { id: 262, name: 'Aaron Paul', character: 'Jesse Pinkman', profilePath: 'https://image.tmdb.org/t/p/w300/paul.jpg' },
      { id: 263, name: 'Anna Gunn', character: 'Skyler White', profilePath: 'https://image.tmdb.org/t/p/w300/gunn.jpg' }
    ],
    trailers: [
      { id: 'tt7', key: 'HhesaQXLuRY', name: 'Series Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    language: 'English',
    country: 'United States'
  },
  {
    id: 76479,
    title: 'The Boys',
    originalTitle: 'The Boys',
    tagline: 'Never meet your heroes.',
    overview: 'A fun and irreverent take on what happens when superheroes—who are as popular as celebrities, as influential as politicians, and as revered as gods—abuse their superpowers rather than use them for good.',
    posterPath: 'https://image.tmdb.org/t/p/w780/7Ns6tO3aYjppI5Lo0FceZZjAev4.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    mediaType: 'tv',
    releaseDate: '2019-07-25',
    voteAverage: 8.5,
    voteCount: 9800,
    genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 10759, name: 'Action & Adventure' }],
    runtime: 60,
    seasonsCount: 4,
    episodesCount: 32,
    status: 'Returning Series',
    creators: ['Eric Kripke'],
    cast: [
      { id: 271, name: 'Karl Urban', character: 'Billy Butcher', profilePath: 'https://image.tmdb.org/t/p/w300/urban.jpg' },
      { id: 272, name: 'Antony Starr', character: 'Homelander', profilePath: 'https://image.tmdb.org/t/p/w300/starr.jpg' },
      { id: 273, name: 'Jack Quaid', character: 'Hughie Campbell', profilePath: 'https://image.tmdb.org/t/p/w300/quaid.jpg' }
    ],
    trailers: [
      { id: 'tt8', key: '06rueu_fh30', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ],
    language: 'English',
    country: 'United States'
  }
];

export const ALL_MEDIA_CATALOG: MediaItem[] = [...CURATED_MOVIES, ...CURATED_TV_SHOWS];
