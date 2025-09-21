import type { ReactNode } from "react";
import styles from "./HomeSection.module.css";

interface HomeSectionProps {
  backgroundColor?: string;
  color?: string;
  reverse?: boolean;
  children: ReactNode;
}

const HomeSection = ({
  backgroundColor,
  color,
  reverse = false,
  children,
}: HomeSectionProps) => {
  return (
    <section className={styles.homeSection} style={{ backgroundColor, color }}>
      <div
        className={`${styles.sectionContent} ${reverse ? styles.reverse : ""}`}
      >
        {children}
      </div>
    </section>
  );
};

export default HomeSection;
