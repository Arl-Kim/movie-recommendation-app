import { useState } from "react";
import { useAppActions } from "../../hooks/useAppActions.ts";
import type { RegisterData } from "../../types/auth.ts";
import styles from "./Auth.module.css";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const RegisterForm = ({ onSwitchToLogin, onClose }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register, authClearError } = useAppActions();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authClearError();
    try {
      await register(formData);
      onClose();
    } catch (error) {
      // Error is handled by the auth state
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.welcomeText}>
        <h3>Create Your Account</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i
              onClick={togglePasswordVisibility}
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            />
          </div>
          <span className={styles.helpText}>
            At least 8 characters with letters, numbers & symbols
          </span>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.submitButtonContainer}>
          <button type="submit" className={styles.submitButton}>
            Create Account
          </button>
        </div>
      </form>
      <p className={styles.switchText}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className={styles.switchButton}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
