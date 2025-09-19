import { useEffect, useState } from "react";
import { tmdbApiService } from "./services/tmdbApiClient";
import type { MoviesResponse } from "./types/movie";
import "./App.css";
import Spinner from "./components/Spinner/Spinner";

const App = () => {
  const [movies, setMovies] = useState<MoviesResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tmdbApiService.getPopularMovies(1);
        setMovies(data);
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
      <h1>Popular Movies</h1>
      <pre>{JSON.stringify(movies, null, 2)}</pre>
    </div>
  );
};

export default App;
