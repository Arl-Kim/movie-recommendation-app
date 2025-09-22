import { useState } from "react";
import { useAppActions } from "../../hooks/useAppActions.ts";
import type { LoginCredentials } from "../../types/auth.ts";
import { validateEmail, validatePassword } from "../../utils/validation.ts";
import styles from "./Auth.module.css";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = ({ onSwitchToRegister, onClose }: LoginFormProps) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, authClearError } = useAppActions();
  const [errors, setErrors] = useState<FormErrors>({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = (): boolean => {
    const emailValidation = validateEmail(credentials.email);
    const passwordValidation = validatePassword(credentials.password);

    const newErrors: FormErrors = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authClearError();

    if (!validateForm()) {
      return;
    }

    await login(credentials);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      const validation = validateEmail(value);
      setErrors((prev) => ({
        ...prev,
        email: validation.isValid ? undefined : validation.errors[0],
      }));
    }

    if (name === "password") {
      const validation = validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        password: validation.isValid ? undefined : validation.errors[0],
      }));
    }
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.welcomeText}>
        <h3>Welcome Back</h3>
        <p>Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>
        <div className={`${styles.passwordFormGroup} ${styles.formGroup}`}>
          <label htmlFor="password">Password</label>
          <div className={styles.inputIcon}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <i
              onClick={togglePasswordVisibility}
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            />
          </div>
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}
        </div>
        <div className={styles.remember}>
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={handleChange}
            />
            <span></span>
            Remember Me
          </label>
        </div>
        <div className={styles.submitButtonContainer}>
          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
        </div>
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
