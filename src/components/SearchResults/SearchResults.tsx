import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import type { Movie } from "../../types/movie.ts";
import MovieList from "../../components/MovieList/MovieList.tsx";
import Spinner from "../../components/Spinner/Spinner.tsx";
import styles from "./SearchResults.module.css";
import MovieDetails from "../MovieDetails/MovieDetails.tsx";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = async (searchQuery: string, page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await tmdbApiService.searchMovies(searchQuery, page);

      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages
      setTotalResults(data.total_results); // Capture total results
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Oops! Could not load search results. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setCurrentPage(1); // Reset to first page for new search
      fetchSearchResults(query, 1);
    } else {
      setMovies([]);
      setTotalResults(0);
      setIsLoading(false);
    }
  }, [query]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (query) {
      fetchSearchResults(query, page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
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

      {selectedMovieId && (
        <MovieDetails movieId={selectedMovieId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SearchResults;
