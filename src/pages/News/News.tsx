import { Link } from "react-router-dom";
import styles from "./News.module.css";

const News = () => {
  return (
    <div className={styles.newsContainer}>
      <h2>Movie News</h2>
      <p>
        News about movies in your Favorites and Watchlist collections will
        appear here. Meanwhile keep <Link to="/recommendations">Exploring</Link>{" "}
        the app.{" "}
      </p>
    </div>
  );
};

export default News;
