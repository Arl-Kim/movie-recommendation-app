import { useEffect, useState } from "react";
import { tmdbApiService } from "./services/tmdbApiClient.ts";
import type { Movie } from "./types/movie.ts";
import "./App.css";
import Spinner from "./components/Spinner/Spinner.tsx";
import MovieList from "./components/MovieList/MovieList.tsx";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tmdbApiService.getPopularMovies(1);
        // Store just the array of movies in state
        setMovies(data.results);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Oops! Could not load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Recommendations</h1>
      </header>
      <main className="main-content">
        <MovieList movies={movies} />
      </main>
    </div>
  );
};

export default App;
