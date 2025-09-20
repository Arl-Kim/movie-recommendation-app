import type { Movie } from "../../types/movie.ts";
import type { MovieCategory } from "../../types/movieCategory.ts";
import MovieCard from "../MovieCard/MovieCard.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import Spinner from "../Spinner/Spinner.tsx";
import styles from "./MovieList.module.css";

// Define the props this component expects
interface MovieListProps {
  movies: Movie[];
  category: MovieCategory;
  currentPage: number;
  totalPages: number;
  totalResults?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const MovieList = ({
  movies,
  category,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  isLoading = false,
}: MovieListProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  if (movies.length === 0) {
    return (
      <div className={styles.noMovies}>
        <i className="fa-solid fa-file-circle-exclamation" />
        No movies found.
      </div>
    );
  }

  return (
    <div className={styles.movieListContainer}>
      <section className={styles.movieList}>
        <h3 className={styles.movieListHeading}>
          {category === "search"
            ? `Search Results${totalResults ? ` (${totalResults})` : ""}`
            : `${
                category.charAt(0).toUpperCase() +
                category.slice(1).replace("_", " ")
              } Movies`}
        </h3>
        <div className={styles.movieListGrid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </section>
    </div>
  );
};

export default MovieList;
