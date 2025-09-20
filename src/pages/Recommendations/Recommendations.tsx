import { useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { useAppActions } from "../../hooks/useAppActions.ts";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import type { MovieCategory } from "../../types/movieCategory.ts";
import MovieList from "../../components/MovieList/MovieList.tsx";
import CategorySelector from "../../components/CategorySelector/CategorySelector.tsx";
import Spinner from "../../components/Spinner/Spinner.tsx";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";
import styles from "./Recommendations.module.css";

const Recommendations = () => {
  const { state } = useAppContext();
  const {
    setLoading,
    setError,
    setMovies,
    setCategory,
    setCurrentPage,
    setSelectedMovie,
  } = useAppActions();

  const {
    movies,
    currentCategory,
    currentPage,
    totalPages,
    totalResults,
    isLoading,
    error,
    selectedMovie,
  } = state;

  const fetchMovies = async (category: MovieCategory, page: number) => {
    try {
      setLoading(true);
      setError(null);

      let data;
      switch (category) {
        case "popular":
          data = await tmdbApiService.getPopularMovies(page);
          break;
        case "now_playing":
          data = await tmdbApiService.getNowPlayingMovies(page);
          break;
        case "top_rated":
          data = await tmdbApiService.getTopRatedMovies(page);
          break;
        case "upcoming":
          data = await tmdbApiService.getUpcomingMovies(page);
          break;
        default:
          data = await tmdbApiService.getPopularMovies(page);
      }

      setMovies(
        data.results,
        Math.min(data.total_pages, 500),
        data.total_results
      );
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Oops! Could not load movies. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMovies(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (category: MovieCategory) => {
    setCategory(category);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className={styles.recommendationsContainer}>
      <div className={styles.recommendationsHeader}>
        <h2>Movie Recommendations</h2>
        <CategorySelector
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <MovieList
        movies={movies}
        category={currentCategory}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={handlePageChange}
        onMovieClick={handleMovieClick}
        isLoading={isLoading}
      />

      {selectedMovie && (
        <MovieDetails movieId={selectedMovie.id} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Recommendations;
