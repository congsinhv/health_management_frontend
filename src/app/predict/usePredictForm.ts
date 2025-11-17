import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictFormSchema } from './validation';
import { initialFormData, PredictFormData } from './formHelper';

export const usePredictForm = () => {
  const form = useForm<PredictFormData>({
    resolver: zodResolver(predictFormSchema) as any,
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    form.reset(initialFormData);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (
    onSubmit: (data: PredictFormData) => Promise<void>
  ) => {
    return form.handleSubmit(onSubmit)();
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
