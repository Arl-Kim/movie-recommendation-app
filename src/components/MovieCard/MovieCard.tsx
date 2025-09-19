import type { Movie } from "../../types/movie.ts";
import styles from "./MovieCard.module.css";

// Define the expected props for this component
interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  // Construct the full image URL using the poster_path
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/assets/movie_placeholder.webp";

  return (
    <article className={styles.movieCard}>
      <img
        src={imageUrl}
        alt={`Poster for the movie ${movie.title}`}
        className={styles.movieImage}
        onError={(e) => {
          // Basic error handling for broken images
          (e.target as HTMLImageElement).src = "/placeholder-movie-image.png";
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
