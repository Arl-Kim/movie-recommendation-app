import { useState } from "react";
import { useAppActions } from "../../hooks/useAppActions.ts";
import type { LoginCredentials } from "../../types/auth.ts";
import styles from "./Auth.module.css";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

const LoginForm = ({ onSwitchToRegister, onClose }: LoginFormProps) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const { login, authClearError } = useAppActions();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authClearError();
    try {
      await login(credentials);
      onClose();
    } catch (error) {
      // Error is handled by the auth state
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.welcomeText}>
        <h3>Welcome Back</h3>
        <p>Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={`${styles.passwordFormGroup} ${styles.formGroup}`}>
          <label htmlFor="password">Password</label>
          <div className={styles.inputIcon}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <i
              onClick={togglePasswordVisibility}
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            />
          </div>
        </div>
        <div className={styles.remember}>
          <label>
            <input type="checkbox" />
            <span></span>
            Remember Me
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
      </form>
      <p className={styles.switchText}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className={styles.switchButton}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
