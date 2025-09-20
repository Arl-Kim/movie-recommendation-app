import { type Movie, type MovieCredits } from "./movie.ts";
import { type MovieCategory } from "./movieCategory.ts";

export interface AppState {
  // Movie data
  movies: Movie[];
  selectedMovie: Movie | null;
  movieCredits: MovieCredits | null;

  // UI state
  currentCategory: MovieCategory;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalResults: number;

  // Loading states
  isLoading: boolean;
  isModalLoading: boolean;

  // Error states
  error: string | null;
  modalError: string | null;
}

// Define action types
export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_MODAL_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_MODAL_ERROR"; payload: string | null }
  | {
      type: "SET_MOVIES";
      payload: { movies: Movie[]; totalPages: number; totalResults: number };
    }
  | { type: "SET_SELECTED_MOVIE"; payload: Movie | null }
  | { type: "SET_MOVIE_CREDITS"; payload: MovieCredits | null }
  | { type: "SET_CATEGORY"; payload: MovieCategory }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "RESET_STATE" };
