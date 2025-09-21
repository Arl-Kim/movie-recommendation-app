export interface User {
  id: string;
  email: string;
  name: string;
  favorites: number[];
  watchlist: number[];
  preferences?: {
    favoriteGenres?: number[];
    dislikedGenres?: number[];
  };
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
