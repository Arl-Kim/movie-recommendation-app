import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { useAppActions } from "../../hooks/useAppActions.ts";
import AuthModal from "../Auth/AuthModal.tsx";
import styles from "./Header.module.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    closeMobileMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = (e: React.MouseEvent, path: string) => {
    if (!auth.isAuthenticated && path !== "/") {
      e.preventDefault();
      setShowAuthModal(true);
    }
    closeMobileMenu();
  };

  // Navigation items configuration
  const getNavItems = () => {
    const baseItems = [
      ...(!auth.isAuthenticated ? [{ path: "/", label: "Home" }] : []),
      { path: "/recommendations", label: "Recommendations" },
      ...(auth.isAuthenticated
        ? [
            { path: "/favorites", label: "Favorites" },
            { path: "/watchlist", label: "Watchlist" },
            { path: "/personalized-recommendations", label: "For You" },
          ]
        : []),
      { path: "/news", label: "News" },
    ];

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.textLogo} onClick={closeMobileMenu}>
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

          {/* Desktop Navigation */}
          <nav className={styles.navBar}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.navLinkActive : ""
                }`}
                onClick={(e) => handleNavLinkClick(e, item.path)}
              >
                {item.label}
              </Link>
            ))}

            {auth.isAuthenticated ? (
              <div className={styles.authSection}>
                <div className={styles.profileDetails}>
                  <span className={styles.profileAvatar}>
                    {auth.user?.name.charAt(0)}
                    {auth.user?.name.split(" ")[1]?.charAt(0).toUpperCase() ||
                      auth.user?.name.charAt(1).toUpperCase() ||
                      ""}
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

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <i
              className={`fa-solid ${
                isMobileMenuOpen ? "fa-xmark" : "fa-bars"
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.mobileNavLink} ${
                    location.pathname === item.path
                      ? styles.mobileNavLinkActive
                      : ""
                  }`}
                  onClick={(e) => handleNavLinkClick(e, item.path)}
                >
                  {item.label}
                </Link>
              ))}

              {auth.isAuthenticated ? (
                <div className={styles.mobileAuthSection}>
                  <div className={styles.mobileProfile}>
                    <span className={styles.mobileProfileAvatar}>
                      {auth.user?.name.charAt(0)}
                      {auth.user?.name.split(" ")[1]?.charAt(0).toUpperCase() ||
                        auth.user?.name.charAt(1).toUpperCase() ||
                        ""}
                    </span>
                    <span className={styles.mobileProfileName}>
                      {auth.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className={styles.mobileAuthButton}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className={styles.mobileAuthButton}
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Header;
