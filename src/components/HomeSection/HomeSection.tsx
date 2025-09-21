import type { ReactNode } from "react";
import styles from "./HomeSection.module.css";

interface HomeSectionProps {
  backgroundColor?: string;
  color?: string;
  children: ReactNode;
}

const HomeSection = ({
  backgroundColor,
  color,
  children,
}: HomeSectionProps) => {
  return (
    <section className={styles.homeSection} style={{ backgroundColor, color }}>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
};

export default HomeSection;
