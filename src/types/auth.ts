export interface User {
  id: string;
  email: string;
  name: string;
  favorites: number[];
  watchlist: number[];
  preferences?: UserPreferences;
  interactions: UserInteraction[];
  searchHistory: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserPreferences {
  favoriteGenres: number[];
  dislikedGenres: number[];
  preferredReleaseDecades: number[];
  minRating: number;
  likedKeywords: string[];
  favoriteDirectors: number[];
  favoriteActors: number[];
}

export interface UserInteraction {
  movieId: number;
  type: "click" | "favorite" | "watchlist" | "search";
  timestamp: number;
  metadata?: any;
}
