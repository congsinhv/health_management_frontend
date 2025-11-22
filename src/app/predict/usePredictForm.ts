import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictFormSchema } from './validation';
import { PredictFormData } from './formHelper';

export const usePredictForm = () => {
  const form = useForm<PredictFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(predictFormSchema) as any,
    mode: 'onChange',
  });

  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    form.reset();
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (
    onSubmit: (data: PredictFormData) => Promise<void>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return form.handleSubmit(onSubmit as any)();
  };

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    dirtyFields: form.formState.dirtyFields,
    errors: form.formState.errors,
    resetForm,
    handleSubmit,
  };
};
