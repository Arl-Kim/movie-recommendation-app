import { useAppContext } from "../../contexts/AppContext.tsx";
import { useAppActions } from "../../hooks/useAppActions.ts";
import styles from "./MovieActions.module.css";

interface MovieActionsProps {
  movieId: number;
}

const MovieActions = ({ movieId }: MovieActionsProps) => {
  const { state } = useAppContext();
  const { toggleFavorite, toggleWatchlist } = useAppActions();

  const isFavorite = state.favorites.includes(movieId);
  const isInWatchlist = state.watchlist.includes(movieId);

  const handleFavoriteClick = () => {
    if (state.auth.isAuthenticated) {
      toggleFavorite(movieId);
    }
  };

  const handleWatchlistClick = () => {
    if (state.auth.isAuthenticated) {
      toggleWatchlist(movieId);
    }
  };

  return (
    <div className={styles.movieActions}>
      <button
        onClick={handleFavoriteClick}
        className={`${styles.actionButton} ${isFavorite ? styles.active : ""}`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <i
          className={`fa-solid ${
            isFavorite ? "fa-heart" : "fa-heart-circle-plus"
          }`}
        />
        <span>{isFavorite ? "In Favorites" : "Favorite"}</span>
      </button>

      <button
        onClick={handleWatchlistClick}
        className={`${styles.actionButton} ${
          isInWatchlist ? styles.active : ""
        }`}
        title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        <i
          className={`fa-solid ${
            isInWatchlist ? "fa-bookmark" : "fa-circle-plus"
          }`}
        />
        <span>{isInWatchlist ? "In Watchlist" : "Watchlist"}</span>
      </button>
    </div>
  );
};

export default MovieActions;
