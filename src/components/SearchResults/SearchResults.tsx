import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { useAppActions } from "../../hooks/useAppActions.ts";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import { personalizationService } from "../../services/personalizationService.ts";
import MovieList from "../MovieList/MovieList.tsx";
import MovieDetails from "../MovieDetails/MovieDetails.tsx";
import Spinner from "../Spinner/Spinner.tsx";
import styles from "./SearchResults.module.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { state } = useAppContext();
  const { auth } = state;
  const {
    setLoading,
    setError,
    setMovies,
    setSearchQuery,
    setCurrentPage,
    setSelectedMovie,
  } = useAppActions();

  const {
    movies,
    currentPage,
    totalPages,
    totalResults,
    isLoading,
    error,
    selectedMovie,
  } = state;

  const fetchSearchResults = async (searchQuery: string, page: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await tmdbApiService.searchMovies(searchQuery, page);

      setMovies(
        data.results,
        Math.min(data.total_pages, 500),
        data.total_results
      );
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Oops! Could not load search results. Please try again later.");
    }
  };

  useEffect(() => {
    // Update search query in global state
    setSearchQuery(query);

    if (query) {
      setCurrentPage(1); // Reset to first page for new search
      fetchSearchResults(query, 1);
    } else {
      // Clear movies if no query
      setMovies([], 1, 0);
    }
  }, [query]);

  // Track search in user history
  useEffect(() => {
    if (query && auth.isAuthenticated && auth.user) {
      personalizationService.addSearchToHistory(auth.user.id, query);
    }
  }, [query, auth.isAuthenticated, auth.user]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (query) {
      fetchSearchResults(query, page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle movie card clicks
  const handleMovieClick = (movieId: number) => {
    const movie = movies.find((m) => m.id === movieId) || null;
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.searchResults}>
      <div className={styles.searchHeader}>
        <h2>{query ? `Search Results for "${query}"` : "Search Movies"}</h2>
        {!query && (
          <p className={styles.searchPrompt}>
            Enter a search term in the search bar above to find movies
          </p>
        )}
      </div>

      {query && movies.length === 0 ? (
        <div className={styles.noResults}>
          <i className="fa-solid fa-file-circle-exclamation" />
          <p>No movies found for "{query}"</p>
          <p>Try a different search term</p>
        </div>
      ) : (
        <MovieList
          movies={movies}
          category="search"
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          onPageChange={handlePageChange}
          onMovieClick={handleMovieClick}
          isLoading={isLoading}
        />
      )}

      {selectedMovie && (
        <MovieDetails movieId={selectedMovie.id} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SearchResults;
