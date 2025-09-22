import type { User, UserInteraction, UserPreferences } from "../types/auth.ts";
import type { Movie, MovieCredits } from "../types/movie.ts";
import { tmdbApiService } from "./tmdbApiClient.ts";

const STORAGE_KEY = "movieAppUserData";
const INTERACTION_LIMIT = 100; // Keep last 100 interactions for now
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for now

// Cache for movie details to avoid repeated API calls
const movieDetailsCache: Map<number, { movie: Movie; timestamp: number }> =
  new Map();
const genreCache: Map<number, string> = new Map();

// Helper function to ensure UserPreferences has all required properties
const ensureFullPreferences = (
  prefs: Partial<UserPreferences>
): UserPreferences => {
  return {
    favoriteGenres: [],
    dislikedGenres: [],
    preferredReleaseDecades: [],
    minRating: 6,
    likedKeywords: [],
    favoriteDirectors: [],
    favoriteActors: [],
    ...prefs,
  };
};

// Helper function to ensure User has all required properties (for backward compatibility)
const ensureFullUser = (user: Partial<User> & { id: string }): User => {
  return {
    email: "",
    name: "",
    favorites: [],
    watchlist: [],
    preferences: ensureFullPreferences({}),
    interactions: [],
    searchHistory: [],
    ...user,
  };
};

export const personalizationService = {
  // Get user data from localStorage
  getUserData: (): Record<string, User> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return {};

      const userData = JSON.parse(data);

      Object.keys(userData).forEach((userId) => {
        userData[userId] = ensureFullUser(userData[userId]);
      });

      return userData;
    } catch {
      return {};
    }
  },

  // Initialize user data if it doesn't exist
  ensureUserExists: (userId: string): User => {
    const userData = personalizationService.getUserData();

    if (!userData[userId]) {
      // Create a basic user structure (Just incase of failure but unlikely)
      userData[userId] = ensureFullUser({
        id: userId,
        email: "",
        name: "",
      });
      personalizationService.saveUserData(userData);
    }

    return userData[userId];
  },

  // Save user data to localStorage
  saveUserData: (data: Record<string, User>): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  },

  // Track user interaction
  trackInteraction: (
    userId: string,
    interaction: Omit<UserInteraction, "timestamp">
  ): void => {
    const userData = personalizationService.getUserData();
    const user = personalizationService.ensureUserExists(userId);

    // Ensure interactions array exists
    if (!user.interactions) {
      user.interactions = [];
    }

    user.interactions.unshift({
      ...interaction,
      timestamp: Date.now(),
    });

    // Keep only the most recent interactions
    user.interactions = user.interactions.slice(0, INTERACTION_LIMIT);

    userData[userId] = user;
    personalizationService.saveUserData(userData);
  },

  // Add search to history
  addSearchToHistory: (userId: string, query: string): void => {
    const userData = personalizationService.getUserData();
    const user = personalizationService.ensureUserExists(userId);

    // Ensure searchHistory array exists
    if (!user.searchHistory) {
      user.searchHistory = [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery && !user.searchHistory.includes(normalizedQuery)) {
      user.searchHistory.unshift(normalizedQuery);
      // Keep only the most recent 20 searches
      user.searchHistory = user.searchHistory.slice(0, 20);
    }

    userData[userId] = user;
    personalizationService.saveUserData(userData);
  },

  // Add/Remove from favorites with interaction tracking
  toggleFavorite: (userId: string, movieId: number): User => {
    const userData = personalizationService.getUserData();
    const user = personalizationService.ensureUserExists(userId);

    // Ensure favorites array exists
    if (!user.favorites) {
      user.favorites = [];
    }

    const isFavorite = user.favorites.includes(movieId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id !== movieId);
      personalizationService.trackInteraction(userId, {
        movieId,
        type: "favorite",
        metadata: { action: "remove" },
      });
    } else {
      user.favorites = [...user.favorites, movieId];
      personalizationService.trackInteraction(userId, {
        movieId,
        type: "favorite",
        metadata: { action: "add" },
      });
    }

    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return user;
  },

  // Add/Remove from watchlist with interaction tracking
  toggleWatchlist: (userId: string, movieId: number): User => {
    const userData = personalizationService.getUserData();
    const user = personalizationService.ensureUserExists(userId);

    // Ensure watchlist array exists
    if (!user.watchlist) {
      user.watchlist = [];
    }

    const inWatchlist = user.watchlist.includes(movieId);

    if (inWatchlist) {
      user.watchlist = user.watchlist.filter((id) => id !== movieId);
      personalizationService.trackInteraction(userId, {
        movieId,
        type: "watchlist",
        metadata: { action: "remove" },
      });
    } else {
      user.watchlist = [...user.watchlist, movieId];
      personalizationService.trackInteraction(userId, {
        movieId,
        type: "watchlist",
        metadata: { action: "add" },
      });
    }

    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return user;
  },

  // Track movie click
  trackMovieClick: (userId: string, movieId: number): void => {
    personalizationService.trackInteraction(userId, {
      movieId,
      type: "click",
    });
  },

  // Get user's favorite movies
  getFavorites: (userId: string): number[] => {
    const userData = personalizationService.getUserData();
    const user = userData[userId];
    return user?.favorites || [];
  },

  // Get user's watchlist
  getWatchlist: (userId: string): number[] => {
    const userData = personalizationService.getUserData();
    const user = userData[userId];
    return user?.watchlist || [];
  },

  // Get user interactions
  getInteractions: (userId: string): UserInteraction[] => {
    const userData = personalizationService.getUserData();
    const user = userData[userId];
    return user?.interactions || [];
  },

  // Get search history
  getSearchHistory: (userId: string): string[] => {
    const userData = personalizationService.getUserData();
    const user = userData[userId];
    return user?.searchHistory || [];
  },

  // Check if movie is in favorites
  isFavorite: (userId: string, movieId: number): boolean => {
    const favorites = personalizationService.getFavorites(userId);
    return favorites.includes(movieId);
  },

  // Check if movie is in watchlist
  isInWatchlist: (userId: string, movieId: number): boolean => {
    const watchlist = personalizationService.getWatchlist(userId);
    return watchlist.includes(movieId);
  },

  // Get movie details with caching
  async getMovieDetails(movieId: number): Promise<Movie> {
    const cached = movieDetailsCache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.movie;
    }

    try {
      const movie = await tmdbApiService.getMovieById(movieId);
      movieDetailsCache.set(movieId, { movie, timestamp: Date.now() });
      return movie;
    } catch (error) {
      console.error(`Failed to fetch movie ${movieId}:`, error);
      throw error;
    }
  },

  // Get movie credits
  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    return await tmdbApiService.getMovieCredits(movieId);
  },

  // Analyze user preferences from interactions
  async analyzeUserPreferences(userId: string): Promise<UserPreferences> {
    const userData = personalizationService.getUserData();
    const user = userData[userId];

    if (!user) {
      return ensureFullPreferences({});
    }

    const interactions = (user.interactions || []).filter(i => i.type === 'click' || i.type === 'favorite');
    const movieIds = [...new Set(interactions.map(i => i.movieId))];
    
    if (movieIds.length === 0) {
      return ensureFullPreferences(user.preferences || {});
    }

    // Get details for all interacted movies
    const movies = await Promise.all(
      movieIds.map(id => personalizationService.getMovieDetails(id).catch(() => null))
    );
    
    const validMovies = movies.filter((m): m is Movie => m !== null);
    
    // Analyze genres
    const genreCount: Map<number, number> = new Map();
    validMovies.forEach(movie => {
      // @ts-expect-error - TMDB movie has genres array
      movie.genres?.forEach((genre: { id: number; name: string }) => {
        genreCount.set(genre.id, (genreCount.get(genre.id) || 0) + 1);
        genreCache.set(genre.id, genre.name);
      });
    });

    const favoriteGenres = Array.from(genreCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => id);

    // Analyze release decades
    const decadeCount: Map<number, number> = new Map();
    validMovies.forEach(movie => {
      if (movie.release_date) {
        const year = new Date(movie.release_date).getFullYear();
        const decade = Math.floor(year / 10) * 10;
        decadeCount.set(decade, (decadeCount.get(decade) || 0) + 1);
      }
    });

    const preferredReleaseDecades = Array.from(decadeCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([decade]) => decade);

    // Analyze ratings
    const ratings = validMovies.map(m => m.vote_average).filter(r => r > 0);
    const minRating = ratings.length > 0 ? Math.floor(Math.min(...ratings)) : 6;

    // Update user preferences
    const updatedPreferences = ensureFullPreferences({
      ...user.preferences,
      favoriteGenres,
      preferredReleaseDecades,
      minRating: Math.max(5, minRating)
    });

    user.preferences = updatedPreferences;
    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return updatedPreferences;
  },

  // Get personalized recommendations based on user preferences
  async getPersonalizedRecommendations(userId: string): Promise<Movie[]> {
    try {
      const userData = personalizationService.getUserData();
      const user = userData[userId];

      if (!user) return [];

      // Analyze preferences if we have interactions
      if (user.interactions && user.interactions.length > 0) {
        await personalizationService.analyzeUserPreferences(userId);
      }

      const preferences = ensureFullPreferences(user.preferences || {});
      
      // If no preferences yet, return popular movies
      if (preferences.favoriteGenres.length === 0) {
        const popularMovies = await tmdbApiService.getPopularMovies(1);
        return popularMovies.results.slice(0, 12);
      }

      // Build discover query based on preferences
      const queryParams: any = {
        sort_by: 'popularity.desc',
        'vote_average.gte': preferences.minRating,
        page: 1
      };

      if (preferences.favoriteGenres.length > 0) {
        queryParams.with_genres = preferences.favoriteGenres.join(',');
      }

      if (preferences.preferredReleaseDecades.length > 0) {
        const currentDecade = preferences.preferredReleaseDecades[0];
        queryParams['primary_release_date.gte'] = `${currentDecade}-01-01`;
        queryParams['primary_release_date.lte'] = `${currentDecade + 9}-12-31`;
      }

      // Use TMDB discover endpoint
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&${new URLSearchParams(queryParams).toString()}`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results.slice(0, 20);

    } catch (error) {
      console.error("Failed to get personalized recommendations:", error);
      // Fallback to popular movies
      const popularMovies = await tmdbApiService.getPopularMovies(1);
      return popularMovies.results.slice(0, 12);
    }
  },

  // Update user preferences
  updatePreferences: (userId: string, preferences: Partial<UserPreferences>): User => {
    const userData = personalizationService.getUserData();
    const user = userData[userId];

    if (!user) throw new Error("User not found");

    user.preferences = ensureFullPreferences({ ...user.preferences, ...preferences });
    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return user;
  },

  // Clear user data (for testing/logout)
  clearUserData: (userId: string): void => {
    const userData = personalizationService.getUserData();
    delete userData[userId];
    personalizationService.saveUserData(userData);
  },
};
