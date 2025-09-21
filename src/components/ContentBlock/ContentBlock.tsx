import type { ReactNode } from "react";
import styles from "./ContentBlock.module.css";

interface ContentBlockProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  children?: ReactNode;
}

const ContentBlock = ({
  title,
  description,
  buttonText,
  onButtonClick,
  children,
}: ContentBlockProps) => {
  return (
    <div className={styles.contentBlock}>
      {children && <div className={styles.mediaContent}>{children}</div>}
      <div className={styles.textContent}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <button onClick={onButtonClick} className={styles.actionButton}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ContentBlock;
