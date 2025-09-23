import type { Movie } from "../../types/movie.ts";
import styles from "./FeaturedMovieCard.module.css";

interface FeaturedMovieCardProps {
  movie: Movie;
  onMovieClick: (movieId: number) => void;
}

const FeaturedMovieCard = ({ movie, onMovieClick }: FeaturedMovieCardProps) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` // Use smaller image size
    : "/assets/movie_placeholder.webp";

  const handleClick = () => {
    onMovieClick(movie.id);
  };

  return (
    <article className={styles.featuredMovieCard} onClick={handleClick}>
      <img
        src={imageUrl}
        alt={`Poster for ${movie.title}`}
        className={styles.featuredMovieImage}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/assets/movie_placeholder.webp";
        }}
      />
      <div className={styles.featuredMovieInfo}>
        <h4 className={`${styles.featuredMovieTitle} ${styles.purpleTitle}`}>
          {movie.title}
        </h4>
        <p className={styles.featuredMovieRating}>
          <i className="fa-solid fa-star" />
          {movie.vote_average.toFixed(1)}
        </p>
        <p className={styles.movieReleaseDate}>{movie.release_date || "TBA"}</p>
      </div>
    </article>
  );
};

export default FeaturedMovieCard;
