import styles from "./Spinner.module.css";

interface SpinnerProps {
  source?: string; // Optional with a default value
}

const Spinner = ({ source = "/assets/spinner_light.mp4" }: SpinnerProps) => {
  return (
    <div className={styles.spinnerContainer} data-testid="spinner">
      <video
        className={styles.spinnerVideo}
        src={source}
        autoPlay
        muted
        loop
      />
    </div>
  );
};

export default Spinner;
