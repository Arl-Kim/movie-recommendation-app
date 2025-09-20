import { authService } from "../services/authService.ts";
import type { AppState, AppAction } from "../types/appState.ts";

// Get initial auth satte from localStorage
const { token, user } = authService.getStoredAuth();

export const initialState: AppState = {
  movies: [],
  selectedMovie: null,
  movieCredits: null,
  currentCategory: "popular",
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  isLoading: false,
  isModalLoading: false,
  error: null,
  modalError: null,
  auth: {
    user: user,
    token: token,
    isAuthenticated: !!token && !!user,
    isLoading: false,
    error: null,
  },
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_MODAL_LOADING":
      return { ...state, isModalLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_MODAL_ERROR":
      return { ...state, modalError: action.payload };

    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload.movies,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        isLoading: false,
        error: null,
      };

    case "SET_SELECTED_MOVIE":
      return { ...state, selectedMovie: action.payload };

    case "SET_MOVIE_CREDITS":
      return { ...state, movieCredits: action.payload };

    case "SET_CATEGORY":
      return {
        ...state,
        currentCategory: action.payload,
        currentPage: 1, // Reset to first page when category changes
        searchQuery: "", // Clear search query when switching categories
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        currentPage: 1, // Reset to first page when search query changes
      };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "RESET_STATE":
      return { ...initialState };

    case "AUTH_START":
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
          error: null,
        },
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        auth: {
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      };

    case "AUTH_FAIL":
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          error: action.payload,
        },
      };

    case "AUTH_LOGOUT":
      return {
        ...state,
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      };

    case "AUTH_CLEAR_ERROR":
      return {
        ...state,
        auth: {
          ...state.auth,
          error: null,
        },
      };

    case "UPDATE_FAVORITES":
      return {
        ...state,
        auth: {
          ...state.auth,
          user: state.auth.user
            ? {
                ...state.auth.user,
                favorites: action.payload,
              }
            : null,
        },
      };

    default:
      return state;
  }
};
