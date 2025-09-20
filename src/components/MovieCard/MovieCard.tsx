import type { Movie } from "../../types/movie.ts";
import styles from "./MovieCard.module.css";

// Define the expected props for this component
interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movieId: number) => void;
}

const MovieCard = ({ movie, onMovieClick }: MovieCardProps) => {
  // Construct the full image URL using the poster_path
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/assets/movie_placeholder.webp";

  const handleClick = () => {
    onMovieClick(movie.id);
  };

  return (
    <article className={styles.movieCard} onClick={handleClick}>
      <img
        src={imageUrl}
        alt={`Poster for the movie ${movie.title}`}
        className={styles.movieImage}
        onError={(e) => {
          // Basic error handling for broken images
          (e.target as HTMLImageElement).src = "/assets/movie_placeholder.webp";
        }}
      />
      <div className={styles.movieInfo}>
        <h4 className={styles.movieTitle}>{movie.title}</h4>
        <p className={styles.movieRating}>
          <i className="fa-solid fa-star" />
          {movie.vote_average}
        </p>
        <p className={styles.movieOverview}>{movie.overview}</p>
        <p className={styles.movieReleaseDate}>{movie.release_date || "TBA"}</p>
      </div>
    </article>
  );
};

export default MovieCard;
