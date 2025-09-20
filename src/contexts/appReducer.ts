import type { AppState, AppAction } from "../types/appState.ts";

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

    default:
      return state;
  }
};
