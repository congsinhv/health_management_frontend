'use client';

import { useState, useEffect } from 'react';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

interface UseAuthFormProps<T extends Record<string, unknown>> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
}

interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useAuthForm<T extends Record<string, unknown>>({
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

  const handleChange = (name: keyof T, value: unknown) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
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

    // Check if form is valid after marking as touched
    if (!state.isValid) {
      // Don't proceed if validation fails
      return;
    }

    if (state.isSubmitting) {
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
    errors.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!values.password) {
    errors.password = 'Mật khẩu là bắt buộc';
  } else if (values.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return errors;
};

export const validateRegister = (
  values: RegisterCredentials
): Partial<Record<keyof RegisterCredentials, string>> => {
  const errors: Partial<Record<keyof RegisterCredentials, string>> = {};

  if (!values.firstName) {
    errors.firstName = 'Tên là bắt buộc';
  } else if (values.firstName.length < 2) {
    errors.firstName = 'Tên phải có ít nhất 2 ký tự';
  }

  if (!values.lastName) {
    errors.lastName = 'Họ là bắt buộc';
  } else if (values.lastName.length < 2) {
    errors.lastName = 'Họ phải có ít nhất 2 ký tự';
  }

  if (!values.email) {
    errors.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!values.password) {
    errors.password = 'Mật khẩu là bắt buộc';
  } else if (values.password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password =
      'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  return errors;
};
