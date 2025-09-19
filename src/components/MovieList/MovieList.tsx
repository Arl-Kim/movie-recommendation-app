import type { Movie } from "../../types/movie.ts";
import MovieCard from "../MovieCard/MovieCard.tsx";
import styles from "./MovieList.module.css";

// Define the props this component expects
interface MovieListProps {
  movies: Movie[];
}

const MovieList = ({ movies }: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <div className={styles.noMovies}>
        <i className="fa-solid fa-file-circle-exclamation" />
        No movies found.
      </div>
    );
  }

  return (
    <section className={styles.movieListContainer}>
      <div className={styles.movieList}>
        <h2 className={styles.movieListHeading}>Popular Movies</h2>
        <div className={styles.movieListGrid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieList;
