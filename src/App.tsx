import { useEffect, useState } from "react";
import { tmdbApiService } from "./services/tmdbApiClient.ts";
import type { Movie } from "./types/movie.ts";
import "./App.css";
import Spinner from "./components/Spinner/Spinner.tsx";
import MovieList from "./components/MovieList/MovieList.tsx";
import type { MovieCategory } from "./types/movieCategory.ts";
import CategorySelector from "./components/CategorySelector/CategorySelector.tsx";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<MovieCategory>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async (category: MovieCategory, page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      let data;
      switch (category) {
        case "popular":
          data = await tmdbApiService.getPopularMovies(page);
          break;
        case "now_playing":
          data = await tmdbApiService.getNowPlayingMovies(page);
          break;
        case "top_rated":
          data = await tmdbApiService.getTopRatedMovies(page);
          break;
        case "upcoming":
          data = await tmdbApiService.getUpcomingMovies(page);
          break;
        default:
          data = await tmdbApiService.getPopularMovies(page);
      }

      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Oops! Could not load movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (category: MovieCategory) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <CategorySelector
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        />
      </header>
      <main className="main-content">
        <MovieList
          movies={movies}
          category={currentCategory}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
