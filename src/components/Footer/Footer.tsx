import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.tsx";
import AuthModal from "../Auth/AuthModal.tsx";
import styles from "./Footer.module.css";

const Footer = () => {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const { state } = useAppContext();
  const { auth } = state;

  const handleQuickLinksClick = (e: React.MouseEvent) => {
    if (!auth.isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.upperFooter}>
            <div className={styles.logoTextSocials}>
              <h4 className={styles.footerTextLogo}>SavannahMovies</h4>
              <p className={styles.footerCtaText}>
                Your go-to destination for discovering the latest and greatest
                movies from around the world. Browse popular, top-rated,
                upcoming and now-playing movies all in one place.
              </p>
              <div className={styles.footerSocials}>
                <a
                  href="https://github.com/Arl-Kim/movie-recommendation-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                >
                  <i className="fa-brands fa-github" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                >
                  <i className="fa-brands fa-x-twitter" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                >
                  <i className="fa-brands fa-instagram" />
                </a>
              </div>
            </div>
            <div className={styles.footerQuickLinks}>
              <h4 className={styles.quickLinksHeading}>Quick Links</h4>
              <Link
                to="/recommendations"
                className={styles.footerLink}
                onClick={handleQuickLinksClick}
              >
                Explore
              </Link>
              <Link
                to="/recommendations"
                className={styles.footerLink}
                onClick={handleQuickLinksClick}
              >
                Recommendations
              </Link>
              <Link
                to="/watchlist"
                className={styles.footerLink}
                onClick={handleQuickLinksClick}
              >
                My Watchlist
              </Link>
              <Link
                to="/news"
                className={styles.footerLink}
                onClick={handleQuickLinksClick}
              >
                News
              </Link>
            </div>
            <div className={styles.footerLegalLinks}>
              <h4 className={styles.legalLinksHeading}>Legal</h4>
              <Link to="#" className={styles.footerLink}>
                Terms of Service
              </Link>
              <Link to="#" className={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link to="#" className={styles.footerLink}>
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className={styles.lowerFooter}>
            <div className={styles.copyright}>
              <i className="fa fa-copyright" />
              2025 Savannah Movies. All Rights Reserved.
            </div>
            <div className={styles.poweredBy}>
              Powered By React, TypeScript, & TMDB API
            </div>
          </div>
        </div>
      </footer>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Footer;
