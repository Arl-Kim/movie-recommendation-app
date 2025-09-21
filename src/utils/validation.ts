export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.push("You did not enter your email!");
  } else if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address!");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required!");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long!");
    }
    if (!/[a-zA-Z]/.test(password)) {
      errors.push("Password must contain at least one letter!");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number!");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one symbol!");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];

  if (!name) {
    errors.push("You did not enter your name!");
  } else if (name.length < 2) {
    errors.push("Name must be at least 2 characters long!");
  } else if (name.length > 50) {
    errors.push("Name must be less than 50 characters long!");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];

  if (!confirmPassword) {
    errors.push("Please confirm your password!");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match!");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
