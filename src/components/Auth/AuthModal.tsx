import { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Spinner from "../Spinner/Spinner";
import styles from "./Auth.module.css";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { state } = useAppContext();
  const { auth } = state;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (auth.isLoading) {
    return (
      <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
        <div className={styles.modalContent}>
          <Spinner source="/assets/spinner_dark.mp4" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>

        {isLogin ? (
          <LoginForm
            onSwitchToRegister={() => setIsLogin(false)}
            onClose={onClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setIsLogin(true)}
            onClose={onClose}
          />
        )}

        {auth.error && (
          <div className={styles.error}>
            <i className="fa-solid fa-circle-exclamation" />
            {auth.error}
          </div>
        )}

        <div className={styles.demoCredentials}>
          <h4>Demo Credentials:</h4>
          <p>Email: demo@savannahmovies.com</p>
          <p>Password: Savannah123*</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
