import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.textLogo}>
          <h3>
            <span className={styles.coloredSpan}>Savannah</span>Movies
          </h3>
        </Link>

        <form className={styles.searchContainer} onSubmit={handleSearchSubmit}>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
