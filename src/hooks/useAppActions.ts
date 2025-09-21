import { useAppContext } from "../contexts/AppContext.tsx";
import { authService } from "../services/authService.ts";
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

    resetState: () => dispatch({ type: "RESET_STATE" }),
  };
};
