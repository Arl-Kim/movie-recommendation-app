import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
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
    </div>
  );
};

export default Home;
