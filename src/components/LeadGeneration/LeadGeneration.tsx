import styles from "./LeadGeneration.module.css";

interface LeadGenerationProps {
  onGetStarted: () => void;
}

const LeadGeneration = ({ onGetStarted }: LeadGenerationProps) => {
  const benefits = [
    {
      icon: "fa-solid fa-clapperboard",
      text: "Personalized recommendations by genre",
    },
    {
      icon: "fa-solid fa-film",
      text: "Access to the latest, most watched, and top-rated movies",
    },
    {
      icon: "fa-solid fa-bookmark",
      text: "Create and manage your own watchlist",
    },
    {
      icon: "fa-solid fa-newspaper",
      text: "Get the latest news about your favorite movies",
    },
    {
      icon: "fa-solid fa-bell",
      text: "Get notified about new releases",
    },
  ];

  return (
    <section className={styles.leadGeneration}>
      <h1 className={styles.mainHeading}>
        Join for Free & Start Watching Smarter
      </h1>
      <p className={styles.mainDescription}>
        Sign up in seconds and unlock personalized movie recommendations,
        watchlists, and much more...
      </p>

      <div className={styles.benefitsSection}>
        <h3 className={styles.benefitsHeading}>What You Get</h3>
        <div className={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <i className={benefit.icon} />
              </div>
              <span className={styles.benefitText}>{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onGetStarted} className={styles.getStartedButton}>
        Get Started
      </button>
    </section>
  );
};

export default LeadGeneration;
