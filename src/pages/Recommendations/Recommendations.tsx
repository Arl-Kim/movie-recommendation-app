import { useEffect, useState } from "react";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import type { Movie } from "../../types/movie.ts";
import type { MovieCategory } from "../../types/movieCategory.ts";
import MovieList from "../../components/MovieList/MovieList.tsx";
import CategorySelector from "../../components/CategorySelector/CategorySelector.tsx";
import Spinner from "../../components/Spinner/Spinner.tsx";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";
import styles from "./Recommendations.module.css";

const Recommendations = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<MovieCategory>("popular");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async (category: MovieCategory, page: number) => {
    try {
      setIsLoading(true);
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

      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages, 500)); // 500 is TMDB limit
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Oops! Could not load movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (category: MovieCategory) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Resets to first page on category change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    <div className={styles.recommendationsContainer}>
      <div className={styles.recommendationsHeader}>
        <h2>Movie Recommendations</h2>
        <CategorySelector
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <MovieList
          movies={movies}
          category={currentCategory}
          currentPage={currentPage}
          totalPages={totalPages}
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

export default Recommendations;
