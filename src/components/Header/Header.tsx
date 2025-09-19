import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.textLogo}>
          <h3>
            <span className={styles.coloredSpan}>Savannah</span>Movies
          </h3>
        </Link>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search movies..."
            className={styles.searchInput}
            disabled // Disabled for now. To enable when I implement search
          />
          <i className="fa-solid fa-search" />
        </div>

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
