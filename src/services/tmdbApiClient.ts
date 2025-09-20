import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import {
  type MoviesResponse,
  type Movie,
  type MovieCredits,
} from "../types/movie.ts";

// Create a customized Axios instance with a base configuration
const tmdbApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.themoviedb.org/3/",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

// Create a simple in-memory cache object
const cache: Record<string, any> = {};

// Define the API service functions
export const tmdbApiService = {
  // Function to get popular movies
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    const cacheKey = `popular_${page}`;

    // Check if the data is already in the cache
    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }

    console.log("Cache miss, fetching from API:", cacheKey);
    // If not in cache, make the API request
    const response: AxiosResponse<MoviesResponse> = await tmdbApiClient.get(
      "movie/popular",
      {
        params: { page }, // Add the "page" parameter for this specific call
      }
    );

    // Store the response data in the cache
    cache[cacheKey] = response.data;

    return response.data;
  },

  // Function to get now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
    const cacheKey = `now_playing_${page}`;
    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }
    console.log("Cache miss, fetching from API:", cacheKey);
    const response: AxiosResponse<MoviesResponse> = await tmdbApiClient.get(
      "movie/now_playing",
      { params: { page } }
    );
    cache[cacheKey] = response.data;
    return response.data;
  },

  // Function to get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    const cacheKey = `top_rated_${page}`;
    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }
    console.log("Cache miss, fetching from API:", cacheKey);
    const response: AxiosResponse<MoviesResponse> = await tmdbApiClient.get(
      "movie/top_rated",
      { params: { page } }
    );
    cache[cacheKey] = response.data;
    return response.data;
  },

  // Function to get upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
    const cacheKey = `upcoming_${page}`;
    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }
    console.log("Cache miss, fetching from API:", cacheKey);
    const response: AxiosResponse<MoviesResponse> = await tmdbApiClient.get(
      "movie/upcoming",
      { params: { page } }
    );
    cache[cacheKey] = response.data;
    return response.data;
  },

  // Function to search movies
  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    const cacheKey = `search_${query}_${page}`;

    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }

    console.log("Cache miss, fetching from API:", cacheKey);
    const response: AxiosResponse<MoviesResponse> = await tmdbApiClient.get(
      "search/movie",
      {
        params: { query, page },
      }
    );

    cache[cacheKey] = response.data;
    return response.data;
  },

  // Function to get a single movie by ID
  async getMovieById(id: number): Promise<Movie> {
    const cacheKey = `movie_${id}`;

    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }

    console.log("Cache miss, fetching from API:", cacheKey);
    const response: AxiosResponse<Movie> = await tmdbApiClient.get(
      `movie/${id}`
    );
    cache[cacheKey] = response.data;
    return response.data;
  },

  // Function to get movie credits
  async getMovieCredits(id: number): Promise<MovieCredits> {
    const cacheKey = `credits_${id}`;

    if (cache[cacheKey]) {
      console.log("Cache hit for:", cacheKey);
      return cache[cacheKey];
    }

    console.log("Cache miss, fetching from API:", cacheKey);
    const response: AxiosResponse<MovieCredits> = await tmdbApiClient.get(
      `movie/${id}/credits`
    );
    cache[cacheKey] = response.data;
    return response.data;
  },
};

export default tmdbApiClient;
