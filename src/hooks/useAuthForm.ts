'use client';

import { useState, useEffect } from 'react';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

interface UseAuthFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useAuthForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseAuthFormProps<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
  });

  // Validate form whenever values change
  useEffect(() => {
    if (validate) {
      const errors = validate(state.values);
      const isValid = Object.keys(errors).length === 0;
      setState(prev => ({ ...prev, errors, isValid }));
    } else {
      setState(prev => ({ ...prev, isValid: true }));
    }
  }, [state.values, validate]);

  const handleChange = (name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      // Don't mark as touched on change - only on submit
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched on submit attempt
    const allTouched = Object.keys(state.values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    ) as Partial<Record<keyof T, boolean>>;

    setState(prev => ({ ...prev, touched: allTouched }));

    if (!state.isValid || state.isSubmitting) {
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit(state.values);
    } catch (error) {
      // Error handling is done in the context
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const reset = () => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
    });
  };

  // Helper function to get error for a field only if it's been touched
  const getFieldError = (fieldName: keyof T): string | undefined => {
    return state.touched[fieldName] ? state.errors[fieldName] : undefined;
  };

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    handleChange,
    handleSubmit,
    reset,
    getFieldError,
  };
}

// Validation functions
export const validateLogin = (
  values: LoginCredentials
): Partial<Record<keyof LoginCredentials, string>> => {
  const errors: Partial<Record<keyof LoginCredentials, string>> = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateRegister = (
  values: RegisterCredentials
): Partial<Record<keyof RegisterCredentials, string>> => {
  const errors: Partial<Record<keyof RegisterCredentials, string>> = {};

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  } else if (values.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  } else if (values.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password =
      'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
