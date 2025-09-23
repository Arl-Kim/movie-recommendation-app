import { useEffect, useState } from "react";
import { tmdbApiService } from "../../services/tmdbApiClient.ts";
import type { Movie, MovieCredits } from "../../types/movie.ts";
import Spinner from "../Spinner/Spinner.tsx";
import styles from "./MovieDetails.module.css";

interface MovieDetailsProps {
  movieId: number;
  onClose: () => void;
}

// Extended movie details interface
interface MovieDetails extends Movie {
  tagline: string;
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  vote_count: number;
  production_companies: { id: number; name: string }[];
}

const MovieDetails = ({ movieId, onClose }: MovieDetailsProps) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch movie details and credits in parallel
        const [movieData, creditsData] = await Promise.all([
          tmdbApiService.getMovieById(movieId),
          tmdbApiService.getMovieCredits(movieId),
        ]);

        setMovie(movieData as MovieDetails);
        setCredits(creditsData);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  // Handle clicking of backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get directors from crew
  const directors =
    credits?.crew
      .filter((person) => person.job === "Director")
      .filter(
        (director, index, self) =>
          index === self.findIndex((d) => d.id === director.id)
      ) || [];

  // Get main cast (first 10 by order)
  const mainCast =
    credits?.cast
      .sort((a, b) => a.order - b.order)
      .filter(
        (actor, index, self) =>
          index === self.findIndex((a) => a.id === actor.id)
      )
      .slice(0, 10) || [];

  // Get other crew members (excluding directors)
  const otherCrew =
    credits?.crew
      .filter((person) => person.job !== "Director")
      .filter(
        (member, index, self) =>
          index ===
          self.findIndex((m) => m.id === member.id && m.job === member.job)
      )
      .slice(0, 10) || [];

  if (isLoading) {
    return (
      <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
        <div className={styles.modalContent}>
          <Spinner source="/assets/spinner_dark.mp4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
        <div className={styles.modalContent}>
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={onClose} className={styles.closeButton}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to create unique keys for crew/cast members
  const getPersonKey = (person: any, index: number) => {
    return `${person.id}-${person.job || person.character}-${index}`;
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>

        <div className={styles.movieDetailsHeader}>
          <div className={styles.posterSection}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/assets/movie_placeholder.webp"
              }
              alt={movie.title}
              className={styles.poster}
            />
          </div>

          <div className={styles.infoSection}>
            <h3 className={styles.title}>{movie.title}</h3>

            {movie.tagline && (
              <p className={styles.tagline}>"{movie.tagline}"</p>
            )}

            <div className={styles.ratingInfo}>
              <span className={styles.rating}>
                <i className="fa-solid fa-star" />
                {movie.vote_average?.toFixed(1)}/10 ({movie.vote_count} votes)
              </span>
              <span className={styles.releaseDate}>
                <i className="fa-solid fa-calendar-days"></i>
                {formatDate(movie.release_date)}
              </span>
            </div>

            {movie.overview && (
              <div className={styles.section}>
                <h4>Overview</h4>
                <p className={styles.overview}>{movie.overview}</p>
              </div>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.section}>
                <h4>Genres</h4>
                <div className={styles.genresList}>
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className={styles.genre}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {directors.length > 0 && (
              <div className={styles.section}>
                <h4>Director{directors.length > 1 ? "s" : ""}</h4>
                <div className={styles.peopleList}>
                  {directors.map((director) => (
                    <div key={director.id} className={styles.person}>
                      <img
                        src={
                          director.profile_path
                            ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
                            : "/assets/person_placeholder.webp"
                        }
                        alt={director.name}
                        className={styles.personImage}
                      />
                      <div className={styles.personInfo}>
                        <span className={styles.personName}>
                          {director.name}
                        </span>
                        <span className={styles.personRole}>
                          {director.job}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {mainCast.length > 0 && (
          <div className={`${styles.section} ${styles.castSection}`}>
            <h4>Cast</h4>
            <div className={styles.castGrid}>
              {mainCast.map((actor, index) => (
                <div
                  key={getPersonKey(actor, index)}
                  className={styles.castMember}
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "/assets/person_placeholder.webp"
                    }
                    alt={actor.name}
                    className={styles.castImage}
                  />
                  <div className={styles.castInfo}>
                    <span className={styles.castName}>{actor.name}</span>
                    <span className={styles.castCharacter}>
                      as {actor.character}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherCrew.length > 0 && (
          <div className={`${styles.section} ${styles.crewSection}`}>
            <h4>Crew</h4>
            <div className={styles.crewList}>
              {otherCrew.map((member, index) => (
                <div
                  key={getPersonKey(member, index)}
                  className={styles.crewMember}
                >
                  <span className={styles.crewName}>{member.name}</span>
                  <span className={styles.crewJob}>{member.job}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
