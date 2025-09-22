import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { useAppActions } from "../../hooks/useAppActions.ts";
import AuthModal from "../Auth/AuthModal.tsx";
import styles from "./Header.module.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { auth } = state;
  const { logout } = useAppActions();

  // Handle submission of search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!auth.isAuthenticated) {
        setShowAuthModal(true);
      } else {
        // Navigate to search results page or update current page
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery(""); // Clear input after search
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleRecommendationsClick = (e: React.MouseEvent) => {
    if (!auth.isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.textLogo}>
            <h3>
              <span className={styles.coloredSpan}>Savannah</span>Movies
            </h3>
          </Link>

          <form
            className={styles.searchContainer}
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Search movies..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className={styles.searchButton}>
              <i className="fa-solid fa-search" />
            </button>
          </form>

          <nav className={styles.navBar}>
            {/* Show Home only for non-authenticated users */}
            {!auth.isAuthenticated && (
              <Link
                to="/"
                className={`${styles.navLink} ${
                  location.pathname === "/" ? styles.navLinkActive : ""
                }`}
              >
                Home
              </Link>
            )}
            <Link
              to="/recommendations"
              className={`${styles.navLink} ${
                location.pathname === "/recommendations"
                  ? styles.navLinkActive
                  : ""
              }`}
              onClick={handleRecommendationsClick}
            >
              Recommendations
            </Link>

            {/* Show additional navigation items for authenticated users */}
            {auth.isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  className={`${styles.navLink} ${
                    location.pathname === "/favorites"
                      ? styles.navLinkActive
                      : ""
                  }`}
                >
                  Favorites
                </Link>
                <Link
                  to="/watchlist"
                  className={`${styles.navLink} ${
                    location.pathname === "/watchlist"
                      ? styles.navLinkActive
                      : ""
                  }`}
                >
                  Watchlist
                </Link>
                <Link
                  to="/personalized-recommendations"
                  className={`${styles.navLink} ${
                    location.pathname === "/personalized-recommendations"
                      ? styles.navLinkActive
                      : ""
                  }`}
                >
                  For You
                </Link>
                <Link
                  to="/news"
                  className={`${styles.navLink} ${
                    location.pathname === "/news" ? styles.navLinkActive : ""
                  }`}
                >
                  News
                </Link>
              </>
            )}

            {auth.isAuthenticated ? (
              <div className={styles.authSection}>
                <div className={styles.profileDetails}>
                  <span className={styles.profileAvatar}>
                    {auth.user?.name.charAt(0)}
                    {auth.user?.name.split(" ")[1]?.charAt(0) || ""}
                  </span>
                </div>
                <button onClick={handleLogout} className={styles.authButton}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={handleAuthClick} className={styles.authButton}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Header;
