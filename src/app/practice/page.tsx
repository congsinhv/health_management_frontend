'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import {
  BasicInfoSection,
  NotesSection,
  ScheduleSection,
  SportsSection,
} from '@/components/practice';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/auth';
import { savePracticePreferences } from '@/services/practice';
import { userService } from '@/services/user';
import type { PracticeFormData } from '@/types/practice';
import { practiceFormSchema } from './validation';

const PracticePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<PracticeFormData>({
    resolver: zodResolver(practiceFormSchema) as Resolver<PracticeFormData>,
    mode: 'onChange',
    defaultValues: {
      basicInfo: {
        height: undefined,
        weight: undefined,
        targetWeight: 0,
        goal: undefined,
      },
      schedule: {
        mode: 'flexible',
        selectedDays: [],
        flexiblePeriods: {},
        fixedPeriod: { startTime: '', endTime: '' },
      },
      sports: {
        predefined: [],
        custom: [],
      },
      notes: {
        personal: '',
        healthWarnings: '',
      },
    },
  });

  // Fetch user profile for pre-fill data
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => userService.getProfile(Number(user?.id)),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Pre-fill form when data loads
  useEffect(() => {
    if (userProfile?.profile) {
      const profile = userProfile.profile;
      if (profile.height_cm) {
        form.setValue('basicInfo.height', profile.height_cm);
      }
      if (profile.weight_kg) {
        form.setValue('basicInfo.weight', profile.weight_kg);
      }
      if (profile.goal) {
        form.setValue(
          'basicInfo.goal',
          profile.goal as 'gain' | 'lose' | 'maintain'
        );
      }
    }
  }, [userProfile, form]);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: savePracticePreferences,
    onSuccess: () => {
      toast.success('Đã lưu thiết lập tập luyện!');
      queryClient.invalidateQueries({ queryKey: ['practiceProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: error => {
      console.error('Submit error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    },
  });

  // Form submission handler
  const onSubmit = async (data: PracticeFormData) => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      // Smoothly scroll to first error field
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstError as HTMLElement).focus?.();
      }
      return;
    }
    submitMutation.mutate(data);
  };

  return (
    <>
      <Header className='sticky top-0 left-0 z-50 w-full' />
      <div className='min-h-screen pt-24'>
        {/* Hero Section */}
        <div className='mb-12 text-center'>
          <h2 className='mb-2 text-5xl font-semibold text-gray-900'>
            Thiết lập kế hoạch tập luyện
          </h2>
          <p className='mx-auto max-w-3xl text-sm text-gray-600'>
            Cá nhân hóa lịch tập luyện và mục tiêu sức khỏe của bạn
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-10 bg-[#F5F4FA] pb-22.25'
          >
            {/* Basic Info Section */}
            <BasicInfoSection
              form={form}
              userProfile={userProfile?.profile || undefined}
            />

            {/* Schedule Section */}
            <ScheduleSection form={form} />

            {/* Sports Section */}
            <SportsSection form={form} />

            {/* Notes Section */}
            <NotesSection form={form} />

            {/* Submit Button */}
            <div className='mx-auto flex w-[82.5%] items-end justify-end gap-5'>
              <div className='h-px w-full bg-[#B3B8C3]' />
              <Button
                type='submit'
                disabled={submitMutation.isPending}
                className='w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto'
              >
                {submitMutation.isPending ? 'Đang lưu...' : 'Lưu thiết lập'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
      <LoadingOverlay
        isVisible={submitMutation.isPending}
        message='Đang lưu thiết lập...'
      />
    </>
  );
};

export default PracticePage;
