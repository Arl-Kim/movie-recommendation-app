import { useAppContext } from "../contexts/AppContext.tsx";
import { authService } from "../services/authService.ts";
import { personalizationService } from "../services/personalizationService.ts";
import type { LoginCredentials, RegisterData } from "../types/auth.ts";
import type { MovieCategory } from "../types/movieCategory.ts";

export const useAppActions = () => {
  const { dispatch } = useAppContext();

  return {
    setLoading: (isLoading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: isLoading }),

    setModalLoading: (isModalLoading: boolean) =>
      dispatch({ type: "SET_MODAL_LOADING", payload: isModalLoading }),

    setError: (error: string | null) =>
      dispatch({ type: "SET_ERROR", payload: error }),

    setModalError: (error: string | null) =>
      dispatch({ type: "SET_MODAL_ERROR", payload: error }),

    setMovies: (movies: any[], totalPages: number, totalResults: number) =>
      dispatch({
        type: "SET_MOVIES",
        payload: { movies, totalPages, totalResults },
      }),

    setSelectedMovie: (movie: any | null) =>
      dispatch({ type: "SET_SELECTED_MOVIE", payload: movie }),

    setMovieCredits: (credits: any) =>
      dispatch({ type: "SET_MOVIE_CREDITS", payload: credits }),

    setCategory: (category: MovieCategory) =>
      dispatch({ type: "SET_CATEGORY", payload: category }),

    setSearchQuery: (query: string) =>
      dispatch({ type: "SET_SEARCH_QUERY", payload: query }),

    setCurrentPage: (page: number) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: page }),

    // Auth actions
    authStart: () => dispatch({ type: "AUTH_START" }),

    authSuccess: (user: any, token: string) =>
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } }),

    authFail: (error: string) =>
      dispatch({ type: "AUTH_FAIL", payload: error }),

    authLogout: () => dispatch({ type: "AUTH_LOGOUT" }),

    authClearError: () => dispatch({ type: "AUTH_CLEAR_ERROR" }),

    updateFavorites: (favorites: number[]) =>
      dispatch({ type: "UPDATE_FAVORITES", payload: favorites }),

    // Personalization actions
    setFavorites: (favorites: number[]) =>
      dispatch({ type: "SET_FAVORITES", payload: favorites }),

    setWatchlist: (watchlist: number[]) =>
      dispatch({ type: "SET_WATCHLIST", payload: watchlist }),

    setPersonalizationLoading: (isLoading: boolean) =>
      dispatch({ type: "SET_PERSONALIZATION_LOADING", payload: isLoading }),

    // Auth operations
    login: async (credentials: LoginCredentials) => {
      dispatch({ type: "AUTH_START" });
      try {
        const response = await authService.login(credentials);
        dispatch({ type: "AUTH_SUCCESS", payload: response });
        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        dispatch({ type: "AUTH_FAIL", payload: message });
        throw error;
      }
    },

    register: async (data: RegisterData) => {
      dispatch({ type: "AUTH_START" });
      try {
        const response = await authService.register(data);
        dispatch({ type: "AUTH_SUCCESS", payload: response });
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        dispatch({ type: "AUTH_FAIL", payload: message });
        throw error;
      }
    },

    logout: async () => {
      try {
        await authService.logout();
        dispatch({ type: "AUTH_LOGOUT" });
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    // Check if user is authenticated on app load
    checkAuth: async () => {
      const rememberMe = authService.getRememberMe();
      if (rememberMe) {
        const { token, user } = authService.getStoredAuth();
        if (token && user) {
          try {
            const validatedUser = await authService.validateToken(token);
            dispatch({
              type: "AUTH_SUCCESS",
              payload: { user: validatedUser, token },
            });
          } catch {
            authService.clearStoredAuth();
            dispatch({ type: "AUTH_LOGOUT" });
          }
        }
      }
    },

    // Personalization operations
    toggleFavorite: async (movieId: number) => {
      const { state } = useAppContext();
      if (!state.auth.user) return;

      try {
        const user = personalizationService.toggleFavorite(
          state.auth.user.id,
          movieId
        );
        if (user.favorites.includes(movieId)) {
          dispatch({ type: "ADD_TO_FAVORITES", payload: movieId });
        } else {
          dispatch({ type: "REMOVE_FROM_FAVORITES", payload: movieId });
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },

    toggleWatchlist: async (movieId: number) => {
      const { state } = useAppContext();
      if (!state.auth.user) return;

      try {
        const user = personalizationService.toggleWatchlist(
          state.auth.user.id,
          movieId
        );
        if (user.watchlist.includes(movieId)) {
          dispatch({ type: "ADD_TO_WATCHLIST", payload: movieId });
        } else {
          dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: movieId });
        }
      } catch (error) {
        console.error("Failed to toggle watchlist:", error);
      }
    },

    loadUserPersonalization: async () => {
      const { state } = useAppContext();
      if (!state.auth.user) return;

      try {
        dispatch({ type: "SET_PERSONALIZATION_LOADING", payload: true });

        const favorites = personalizationService.getFavorites(
          state.auth.user.id
        );
        const watchlist = personalizationService.getWatchlist(
          state.auth.user.id
        );

        dispatch({ type: "SET_FAVORITES", payload: favorites });
        dispatch({ type: "SET_WATCHLIST", payload: watchlist });
      } catch (error) {
        console.error("Failed to load user personalization:", error);
      } finally {
        dispatch({ type: "SET_PERSONALIZATION_LOADING", payload: false });
      }
    },

    getPersonalizedRecommendations: async (): Promise<any[]> => {
      const { state } = useAppContext();
      if (!state.auth.user) return [];

      try {
        return await personalizationService.getPersonalizedRecommendations(
          state.auth.user.id
        );
      } catch (error) {
        console.error("Failed to get personalized recommendations:", error);
        return [];
      }
    },

    resetState: () => dispatch({ type: "RESET_STATE" }),
  };
};
