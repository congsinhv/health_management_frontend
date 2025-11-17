import { useState } from 'react';
import { PredictFormData, FormErrors, initialFormData } from './formHelper';
import { validateForm, hasErrors } from './validation';

export const usePredictForm = () => {
  const [formData, setFormData] = useState<PredictFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = (field: keyof PredictFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const touchField = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  };

  /**
   * Validate the entire form
   */
  const validate = (): boolean => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    return !hasErrors(validationErrors);
  };

  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (
    onSubmit: (data: PredictFormData) => Promise<void>
  ) => {
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allFields);

    // Validate
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    updateField,
    touchField,
    validate,
    resetForm,
    handleSubmit,
  };
};
