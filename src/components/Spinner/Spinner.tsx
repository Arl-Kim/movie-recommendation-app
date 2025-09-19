import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer} data-testid="spinner">
      <video
        className={styles.spinnerVideo}
        src="/assets/spinner_light.mp4"
        autoPlay
        muted
        loop
      />
    </div>
  );
};

export default Spinner;
