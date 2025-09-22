import { useState } from "react";
import { useAppActions } from "../../hooks/useAppActions.ts";
import type { RegisterData } from "../../types/auth.ts";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation.ts";
import styles from "./Auth.module.css";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = (): boolean => {
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    const newErrors: FormErrors = {};

    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.errors[0];
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

    await register(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (name === "name") {
      const validation = validateName(value);
      setErrors((prev) => ({
        ...prev,
        name: validation.isValid ? undefined : validation.errors[0],
      }));
    }

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

    if (name === "confirmPassword") {
      const validation = validateConfirmPassword(formData.password, value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validation.isValid ? undefined : validation.errors[0],
      }));
    }
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.welcomeText}>
        <h3>Create Your Account</h3>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && (
            <span className={styles.errorText}>{errors.name}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
              value={formData.password}
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
          {!errors.password && (
            <span className={styles.helpText}>
              At least 8 characters with letters, numbers & symbols
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.confirmPassword && (
            <span className={styles.errorText}>{errors.confirmPassword}</span>
          )}
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
