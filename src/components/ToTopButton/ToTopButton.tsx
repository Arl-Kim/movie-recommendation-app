import { useEffect, useState } from "react";
import styles from "./ToTopButton.module.css";

const ToTopButton = () => {
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 1500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showScrollToTop && (
        <div className={styles.scrollToTop}>
          <button onClick={scrollToTop} className={styles.scrollToTopBtn}>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default ToTopButton;
