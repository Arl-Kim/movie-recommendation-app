import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import type { Movie } from "../../types/movie.ts";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import Spinner from "../../components/Spinner/Spinner.tsx";
import MovieList from "../../components/MovieList/MovieList.tsx";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";
import styles from "./Watchlist.module.css";

const Watchlist = () => {
  const { state } = useAppContext();
  const { watchlist } = state;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      if (watchlist.length === 0) {
        setMovies([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch details for each watchlist movie
        const moviePromises = watchlist.map((movieId) =>
          tmdbApiService.getMovieById(movieId)
        );

        const watchlistMovies = await Promise.all(moviePromises);
        setMovies(watchlistMovies);
      } catch (err) {
        console.error("Failed to fetch watchlist movies:", err);
        setError("Failed to load watchlist movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [watchlist]);

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
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.watchlistContainer}>
      <div className={styles.watchListHeader}>
        <h2>Your Watchlist</h2>
        <p>You have {movies.length} movie{movies.length > 1 && "s"} in your watchlist</p>
      </div>

      {movies.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-bookmark"></i>
          <h2>Your watchlist is empty</h2>
          <p>
            Start adding movies to your watchlist to keep track of what you want
            to watch! Go to <Link to="/recommendations">Recommendations</Link>
          </p>
        </div>
      ) : (
        <MovieList
          movies={movies}
          category="watchlist"
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

export default Watchlist;
