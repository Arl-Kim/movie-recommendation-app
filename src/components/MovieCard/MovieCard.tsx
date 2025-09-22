import type { Movie } from "../../types/movie.ts";
import MovieActions from "../MovieActions/MovieActions.tsx";
import styles from "./MovieCard.module.css";

// Define the expected props for this component
interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movieId: number) => void;
  showActions?: boolean;
}

const MovieCard = ({
  movie,
  onMovieClick,
  showActions = true,
}: MovieCardProps) => {
  // Construct the full image URL using the poster_path
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/assets/movie_placeholder.webp";

  const handleClick = () => {
    onMovieClick(movie.id);
  };

  return (
    <article className={styles.movieCard}>
      <img
        src={imageUrl}
        alt={`Poster for the movie ${movie.title}`}
        className={styles.movieImage}
        onError={(e) => {
          // Basic error handling for broken images
          (e.target as HTMLImageElement).src = "/assets/movie_placeholder.webp";
        }}
        onClick={handleClick}
      />
      <div className={styles.movieInfo}>
        <h4 className={styles.movieTitle} onClick={handleClick}>{movie.title}</h4>
        <p className={styles.movieRating} onClick={handleClick}>
          <i className="fa-solid fa-star" />
          {movie.vote_average}
        </p>
        <p className={styles.movieOverview} onClick={handleClick}>{movie.overview}</p>
        <p className={styles.movieReleaseDate}>{movie.release_date || "TBA"}</p>
        {showActions && (
          <div onClick={(e) => e.stopPropagation()}>
            <MovieActions movieId={movie.id} />
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCard;
