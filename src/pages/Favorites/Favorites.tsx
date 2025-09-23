import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import type { Movie } from "../../types/movie.ts";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import Spinner from "../../components/Spinner/Spinner.tsx";
import MovieList from "../../components/MovieList/MovieList.tsx";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";
import styles from "./Favorites.module.css";

const Favorites = () => {
  const { state } = useAppContext();
  const { favorites } = state;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (favorites.length === 0) {
        setMovies([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch details for each favorite movie
        const moviePromises = favorites.map((movieId) =>
          tmdbApiService.getMovieById(movieId)
        );

        const favoriteMovies = await Promise.all(moviePromises);
        setMovies(favoriteMovies);
      } catch (err) {
        console.error("Failed to fetch favorite movies:", err);
        setError("Failed to load favorite movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [favorites]);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseMovieDetails = () => {
    setSelectedMovieId(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className={`${styles.error} ${styles.favoritesContainer}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.favoritesContainer}>
      <div className={styles.favoritesHeader}>
        <h2>Your Favorite Movies</h2>
        <p>
          You have {movies.length} movie{movies.length > 1 && "s"} in your
          favorites collection
        </p>
      </div>

      {movies.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-heart"></i>
          <h2>No favorites yet</h2>
          <p>
            Start adding movies to your favorites to see them here! Go to{" "}
            <Link to="/recommendations">Recommendations</Link>
          </p>
        </div>
      ) : (
        <MovieList
          movies={movies}
          category="favorites"
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          onMovieClick={handleMovieClick}
          isLoading={false}
        />
      )}

      {selectedMovieId && (
        <MovieDetails
          movieId={selectedMovieId}
          onClose={handleCloseMovieDetails}
        />
      )}
    </div>
  );
};

export default Favorites;
