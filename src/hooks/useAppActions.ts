import { useAppContext } from "../contexts/AppContext.tsx";
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

    resetState: () => dispatch({ type: "RESET_STATE" }),
  };
};
