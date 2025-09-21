import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useAppActions } from "../../hooks/useAppActions";
import styles from "./Header.module.css";
import AuthModal from "../Auth/AuthModal";

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
      // Navigate to search results page or update current page
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear input after search
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

  // Determine greeting based on user's time
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

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
            <Link
              to="/"
              className={`${styles.navLink} ${
                location.pathname === "/" ? styles.navLinkActive : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/recommendations"
              className={`${styles.navLink} ${
                location.pathname === "/recommendations"
                  ? styles.navLinkActive
                  : ""
              }`}
            >
              Recommendations
            </Link>
            <Link
              to="/news"
              className={`${styles.navLink} ${
                location.pathname === "/news" ? styles.navLinkActive : ""
              }`}
            >
              News
            </Link>

            {auth.isAuthenticated ? (
              <div className={styles.authSection}>
                <div className={styles.profileDetails}>
                  <span className={styles.profileAvatar}>{auth.user?.name.charAt(0)}</span>
                  <span className={styles.greetingText}>{greeting}</span>
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
