import { useCallback } from "react";
import { useAppContext } from "../contexts/AppContext.tsx";
import { authService } from "../services/authService.ts";
import { personalizationService } from "../services/personalizationService.ts";
import type { LoginCredentials, RegisterData } from "../types/auth.ts";
import type { MovieCategory } from "../types/movieCategory.ts";

export const useAppActions = () => {
  const { state, dispatch } = useAppContext();

  // Wrap all actions that need state in useCallback
  const toggleFavorite = useCallback(
    async (movieId: number) => {
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
    [state.auth.user, dispatch]
  );

  const toggleWatchlist = useCallback(
    async (movieId: number) => {
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
    [state.auth.user, dispatch]
  );

  const loadUserPersonalization = useCallback(async () => {
    if (!state.auth.user) return;

    try {
      dispatch({ type: "SET_PERSONALIZATION_LOADING", payload: true });

      const favorites = personalizationService.getFavorites(state.auth.user.id);
      const watchlist = personalizationService.getWatchlist(state.auth.user.id);

      dispatch({ type: "SET_FAVORITES", payload: favorites });
      dispatch({ type: "SET_WATCHLIST", payload: watchlist });
    } catch (error) {
      console.error("Failed to load user personalization:", error);
    } finally {
      dispatch({ type: "SET_PERSONALIZATION_LOADING", payload: false });
    }
  }, [state.auth.user, dispatch]);

  const getPersonalizedRecommendations = useCallback(async (): Promise<
    any[]
  > => {
    if (!state.auth.user) return [];

    try {
      return await personalizationService.getPersonalizedRecommendations(
        state.auth.user.id
      );
    } catch (error) {
      console.error("Failed to get personalized recommendations:", error);
      return [];
    }
  }, [state.auth.user]);

  // Simple actions that don't need state
  const setLoading = (isLoading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: isLoading });

  const setModalLoading = (isModalLoading: boolean) =>
    dispatch({ type: "SET_MODAL_LOADING", payload: isModalLoading });

  const setError = (error: string | null) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const setModalError = (error: string | null) =>
    dispatch({ type: "SET_MODAL_ERROR", payload: error });

  const setMovies = (movies: any[], totalPages: number, totalResults: number) =>
    dispatch({
      type: "SET_MOVIES",
      payload: { movies, totalPages, totalResults },
    });

  const setSelectedMovie = (movie: any | null) =>
    dispatch({ type: "SET_SELECTED_MOVIE", payload: movie });

  const setMovieCredits = (credits: any) =>
    dispatch({ type: "SET_MOVIE_CREDITS", payload: credits });

  const setCategory = (category: MovieCategory) =>
    dispatch({ type: "SET_CATEGORY", payload: category });

  const setSearchQuery = (query: string) =>
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });

  const setCurrentPage = (page: number) =>
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });

  const authStart = () => dispatch({ type: "AUTH_START" });

  const authSuccess = (user: any, token: string) =>
    dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });

  const authFail = (error: string) =>
    dispatch({ type: "AUTH_FAIL", payload: error });

  const authLogout = () => dispatch({ type: "AUTH_LOGOUT" });

  const authClearError = () => dispatch({ type: "AUTH_CLEAR_ERROR" });

  const updateFavorites = (favorites: number[]) =>
    dispatch({ type: "UPDATE_FAVORITES", payload: favorites });

  const setFavorites = (favorites: number[]) =>
    dispatch({ type: "SET_FAVORITES", payload: favorites });

  const setWatchlist = (watchlist: number[]) =>
    dispatch({ type: "SET_WATCHLIST", payload: watchlist });

  const setPersonalizationLoading = (isLoading: boolean) =>
    dispatch({ type: "SET_PERSONALIZATION_LOADING", payload: isLoading });

  const resetState = () => dispatch({ type: "RESET_STATE" });

  // Auth operations
  const login = async (credentials: LoginCredentials) => {
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
  };

  const register = async (data: RegisterData) => {
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
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: "AUTH_LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkAuth = async () => {
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
  };

  return {
    // Simple actions
    setLoading,
    setModalLoading,
    setError,
    setModalError,
    setMovies,
    setSelectedMovie,
    setMovieCredits,
    setCategory,
    setSearchQuery,
    setCurrentPage,
    authStart,
    authSuccess,
    authFail,
    authLogout,
    authClearError,
    updateFavorites,
    setFavorites,
    setWatchlist,
    setPersonalizationLoading,
    resetState,
    // Auth operations
    login,
    register,
    logout,
    checkAuth,
    // Personalization operations
    toggleFavorite,
    toggleWatchlist,
    loadUserPersonalization,
    getPersonalizedRecommendations,
  };
};
