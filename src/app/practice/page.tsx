'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { userService } from '@/services/user';
import { BasicInfoSection, ScheduleSection } from '@/components/practice';
import { practiceFormSchema } from './validation';
import type { PracticeFormData } from '@/types/practice';

const PracticePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<PracticeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(practiceFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      basicInfo: {
        targetWeight: 0,
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

  const onSubmit = async (_data: PracticeFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: API integration in Phase 5
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Submit Button */}
            <div className='mx-auto flex w-[82.5%] items-end justify-end gap-5'>
              <div className='h-px w-full bg-[#B3B8C3]' />
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto'
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thiết lập'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default PracticePage;
