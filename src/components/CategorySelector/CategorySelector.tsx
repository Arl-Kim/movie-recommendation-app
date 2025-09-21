import type { MovieCategory } from "../../types/movieCategory.ts";
import styles from "./CategorySelector.module.css";

interface CategorySelectorProps {
  currentCategory: MovieCategory;
  onCategoryChange: (category: MovieCategory) => void;
}

const categories: MovieCategory[] = [
  "popular",
  "now_playing",
  "top_rated",
  "upcoming",
  "latest",
];

const CategorySelector = ({
  currentCategory,
  onCategoryChange,
}: CategorySelectorProps) => {
  return (
    <nav className={styles.categorySelector}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.categoryButton} ${
            currentCategory === category ? styles.categoryButtonActive : ""
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category.replace("_", " ")}
        </button>
      ))}
    </nav>
  );
};

export default CategorySelector;
