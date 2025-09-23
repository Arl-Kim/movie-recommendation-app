import { useEffect, useState } from "react";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import type { Movie } from "../../types/movie.ts";
import FeaturedMovieCard from "./FeaturedMovieCard.tsx";
import Spinner from "../Spinner/Spinner.tsx";
import styles from "./FeaturedMovie.module.css";

interface FeaturedMovieProps {
  onMovieClick: (movieId: number) => void;
}

const FeaturedMovie = ({ onMovieClick }: FeaturedMovieProps) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get a random movie from an array
  const getRandomMovie = (movies: Movie[]): Movie => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
  };

  // Function to fetch and set a random popular movie
  const fetchRandomMovie = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch popular movies
      const data = await tmdbApiService.getPopularMovies(1);
      const randomMovie = getRandomMovie(data.results);

      setFeaturedMovie(randomMovie);

      // Store the movie and timestamp in localStorage
      const featuredData = {
        movie: randomMovie,
        timestamp: Date.now(),
      };
      localStorage.setItem("featuredMovie", JSON.stringify(featuredData));
    } catch (err) {
      console.error("Failed to fetch featured movie:", err);
      setError("Failed to load featured movie");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAndUpdateFeaturedMovie = async () => {
      const storedData = localStorage.getItem("featuredMovie");
      const now = Date.now();
      const displayHours = 0 * 5 * 60 * 1000; // 5 Minutes for now

      if (storedData) {
        const { movie, timestamp } = JSON.parse(storedData);

        // If less than 4 hours have passed, use the stored movie
        if (now - timestamp < displayHours) {
          setFeaturedMovie(movie);
          setIsLoading(false);
          return;
        }
      }

      // Otherwise, fetch a new random movie
      await fetchRandomMovie();
    };

    checkAndUpdateFeaturedMovie();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.featuredMovieContainer}>
        <Spinner source="/assets/spinner_light.mp4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.featuredMovieContainer}>
        <div className={styles.error}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!featuredMovie) {
    return null;
  }

  return (
    <div className={styles.featuredMovieContainer}>
      <FeaturedMovieCard movie={featuredMovie} onMovieClick={onMovieClick} />
    </div>
  );
};

export default FeaturedMovie;
