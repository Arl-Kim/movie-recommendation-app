import type { User } from "../types/auth.ts";
import type { Movie } from "../types/movie.ts";

const STORAGE_KEY = "movieAppUserData";

export const personalizationService = {
  // Get user data from localStorage
  getUserData: (): Record<string, User> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // Initialize user data if it doesn't exist
  ensureUserExists: (userId: string): User => {
    const userData = personalizationService.getUserData();

    if (!userData[userId]) {
      // Create a basic user structure (Just incase of failure but unlikely)
      userData[userId] = {
        id: userId,
        email: "",
        name: "",
        favorites: [],
        watchlist: [],
        preferences: {},
      };
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

  // Add/Remove from favorites
  toggleFavorite: (userId: string, movieId: number): User => {
    const userData = personalizationService.getUserData();
    const user = personalizationService.ensureUserExists(userId);

    if (!user) throw new Error("User not found");

    const isFavorite = user.favorites.includes(movieId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id !== movieId);
    } else {
      user.favorites = [...user.favorites, movieId];
    }

    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return user;
  },

  // Add/Remove from watchlist
  toggleWatchlist: (userId: string, movieId: number): User => {
    const userData = personalizationService.getUserData();
    const user = personalizationService.ensureUserExists(userId);

    if (!user) throw new Error("User not found");

    const inWatchlist = user.watchlist.includes(movieId);

    if (inWatchlist) {
      user.watchlist = user.watchlist.filter((id) => id !== movieId);
    } else {
      user.watchlist = [...user.watchlist, movieId];
    }

    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return user;
  },

  // Get user's favorite movies
  getFavorites: (userId: string): number[] => {
    const userData = personalizationService.getUserData();
    return userData[userId]?.favorites || [];
  },

  // Get user's watchlist
  getWatchlist: (userId: string): number[] => {
    const userData = personalizationService.getUserData();
    return userData[userId]?.watchlist || [];
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

  // Get personalized recommendations based on user preferences
  getPersonalizedRecommendations: async (userId: string): Promise<Movie[]> => {
    // This would normally call a recommendation API
    // For now, return popular movies as mock recommendations
    const userData = personalizationService.getUserData();
    const user = userData[userId];

    if (!user) return [];

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }`
    );
    const data = await response.json();

    return data.results.slice(0, 12);
  },

  // Update user preferences
  updatePreferences: (userId: string, preferences: any): User => {
    const userData = personalizationService.getUserData();
    const user = userData[userId];

    if (!user) throw new Error("User not found");

    user.preferences = { ...user.preferences, ...preferences };
    userData[userId] = user;
    personalizationService.saveUserData(userData);

    return user;
  },
};
