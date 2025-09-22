import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../types/auth.ts";
import { personalizationService } from "./personalizationService.ts";

// Setup a mock user database
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@savannahmovies.com",
    name: "Demo User",
    favorites: [238, 550, 680], // Some popular movie IDs
    watchlist: [450, 300, 227],
    preferences: {},
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Store keys in localStorage for persistence
const TOKEN_KEY = "movieAppToken";
const USER_KEY = "movieAppUser";
const REMEMBER_ME_KEY = "movieAppRememberMe";

export const authService = {
  // Get stored auth data from localStorage
  getStoredAuth: (): { token: string | null; user: User | null } => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  },

  // Store auth data in localStorage
  setStoredAuth: (token: string, user: User): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Clear stored auth data
  clearStoredAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get users's remember me preference
  getRememberMe: (): boolean => {
    try {
      return localStorage.getItem(REMEMBER_ME_KEY) === "true";
    } catch {
      return false;
    }
  },

  // Set user's remember me preference
  setRememberMe: (remember: boolean): void => {
    if (remember) {
      localStorage.setItem(REMEMBER_ME_KEY, "true");
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  },

  // Mock login function
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1000); // Simulate API call

    if (
      credentials.email === "demo@savannahmovies.com" &&
      credentials.password === "Savannah123*"
    ) {
      const user = mockUsers[0];
      const token = "mock-jwt-token-" + Date.now();

      // Store remember me preference
      authService.setRememberMe(credentials.rememberMe || false);

      // Only store auth if remember me is true
      if (credentials.rememberMe) {
        authService.setStoredAuth(token, user);
      }

      return { user, token };
    }

    throw new Error("Invalid email or password");
  },

  // Mock register function
  register: async (data: RegisterData): Promise<AuthResponse> => {
    await delay(1000);

    // Check if email already exists
    if (mockUsers.some((user) => user.email === data.email)) {
      throw new Error("Something went wrong. Try using another email address");
    }

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      favorites: [],
      watchlist: [],
      preferences: {},
    };

    const token = "mock-jwt-token-" + Date.now();

    mockUsers.push(newUser);
    authService.setStoredAuth(token, newUser);

    // Also initialize in personalization service
    const userData = personalizationService.getUserData();
    userData[newUser.id] = newUser;
    personalizationService.saveUserData(userData);

    return { user: newUser, token };
  },

  // Mock logout function
  logout: async (): Promise<void> => {
    await delay(500);
    authService.clearStoredAuth();
  },

  // Mock token validation
  validateToken: async (token: string): Promise<User> => {
    await delay(500);

    if (token.startsWith("mock-jwt-token-")) {
      const user = mockUsers[0]; // For demo, always return the demo user
      return user;
    }

    throw new Error("Invalid token");
  },
};
