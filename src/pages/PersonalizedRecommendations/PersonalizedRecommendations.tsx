import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { personalizationService } from "../../services/personalizationService.ts";
import type { Movie } from "../../types/movie.ts";
import MovieList from "../../components/MovieList/MovieList.tsx";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";
import Spinner from "../../components/Spinner/Spinner.tsx";
import styles from "./PersonalizedRecommendations.module.css";

const PersonalizedRecommendations = () => {
  const { state } = useAppContext();
  const { auth } = state;
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!auth.isAuthenticated || !auth.user) {
        setError("Please sign in to get personalized recommendations");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const personalizedMovies =
          await personalizationService.getPersonalizedRecommendations(
            auth.user.id
          );
        setRecommendations(personalizedMovies);
      } catch (err) {
        console.error("Failed to fetch personalized recommendations:", err);
        setError(
          "Failed to load personalized recommendations. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [auth.isAuthenticated, auth.user]);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className={styles.personalizedRecommendations}>
        <Spinner />
        <p className={styles.loadingText}>Analyzing your preferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.personalizedRecommendations}>
        <div className={styles.error}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <h3>{error}</h3>
          {auth.isAuthenticated ? (
            <button onClick={handleRetry} className={styles.retryButton}>
              Try Again
            </button>
          ) : (
            <p>Sign in to get personalized movie recommendations</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.personalizedRecommendations}>
      <div className={styles.recommendationsHeader}>
        <h2>Your Personalized Recommendations</h2>
        <p className={styles.subtitle}>
          Based on your favorites, watchlist, and browsing history
        </p>
        {recommendations.length > 0 && (
          <p className={styles.resultCount}>
            Found {recommendations.length} movie
            {recommendations.length > 1 && "s"} we think you'll love
          </p>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <h3>Not enough data yet</h3>
          <p>
            Start browsing and searching movies, adding to favorites, and
            building your watchlist to get better recommendations!
          </p>
        </div>
      ) : (
        <MovieList
          movies={recommendations}
          category="personalized"
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          onMovieClick={handleMovieClick}
          isLoading={false}
        />
      )}

      {selectedMovieId && (
        <MovieDetails movieId={selectedMovieId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
