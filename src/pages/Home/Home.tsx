import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import HomeSection from "../../components/HomeSection/HomeSection.tsx";
import ContentBlock from "../../components/ContentBlock/ContentBlock.tsx";
import FeaturedMovie from "../../components/FeaturedMovie/FeaturedMovie.tsx";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";
import AuthModal from "../../components/Auth/AuthModal.tsx";
import LeadGeneration from "../../components/LeadGeneration/LeadGeneration.tsx";
import styles from "./Home.module.css";

const Home = () => {
  const { state } = useAppContext();
  const { auth } = state;
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const handleAuthAction = (action: () => void) => {
    if (auth.isAuthenticated) {
      action();
    } else {
      setShowAuthModal(true);
      setAuthMode("login");
    }
  };

  const handleExploreMovies = () => {
    navigate("/recommendations");
  };

  const handleCreateCollection = () => {
    navigate("/recommendations");
  };

  const handleSeeNews = () => {
    navigate("/news");
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
    setAuthMode("register");
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleSwitchToRegister = () => {
    setAuthMode("register");
  };

  const handleSwitchToLogin = () => {
    setAuthMode("login");
  };

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseMovieDetails = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.hero}>
        <h1 className={styles.heroHeading}>
          Get Personalized Movie Recommendations
        </h1>
        <Link to="/recommendations" className={styles.ctaButton}>
          Explore Movies
        </Link>
      </div>
      <HomeSection>
        <ContentBlock
          title="What Are Your Favorite Genres?"
          description="Select a genre to see recommendations tailored to your taste. From action to romance, we've got you covered."
          buttonText="Choose Your Genre"
          onButtonClick={() => handleAuthAction(handleExploreMovies)}
        >
          <FeaturedMovie onMovieClick={handleMovieClick} />
        </ContentBlock>
      </HomeSection>

      <HomeSection
        backgroundColor="var(--dark-violet)"
        color="var(--strong-yellow-green)"
        reverse={true}
      >
        <ContentBlock
          title="Add Movies To Your Collection"
          description="Browse movies and add them to your favorites and watchlist. Build your personal movie library."
          buttonText="Create Collection"
          onButtonClick={() => handleAuthAction(handleCreateCollection)}
        >
          <FeaturedMovie onMovieClick={handleMovieClick} />
        </ContentBlock>
      </HomeSection>

      <HomeSection>
        <ContentBlock
          title="See Latest News About Your Favorite Movies"
          description="Stay informed with the latest comments, reviews, and updates from the movie world."
          buttonText="See News"
          onButtonClick={() => handleAuthAction(handleSeeNews)}
        >
          <FeaturedMovie onMovieClick={handleMovieClick} />
        </ContentBlock>
      </HomeSection>

      {!auth.isAuthenticated && (
        <LeadGeneration onGetStarted={handleGetStarted} />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={handleCloseAuthModal}
          initialMode={authMode}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {selectedMovieId && (
        <MovieDetails
          movieId={selectedMovieId}
          onClose={handleCloseMovieDetails}
        />
      )}
    </div>
  );
};

export default Home;
