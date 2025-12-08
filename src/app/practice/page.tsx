'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
  NotificationSetupModal,
} from '@/components/practice';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/auth';
import { savePracticeSchedule } from '@/services/practice';
import { deviceService } from '@/services/device';
import { userService } from '@/services/user';
import { isMobileDevice } from '@/lib/utils/platform';
import { requestNotificationPermissionWithDetails } from '@/lib/firebase';
import { useDevices, useRegisterDevice } from '@/hooks/useDevices';
import type { PracticeFormData } from '@/types/practice';
import { practiceFormSchema } from './validation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

const PracticePageContent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Notification modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isAutoRegistering, setIsAutoRegistering] = useState(false);

  // Refs to prevent duplicate operations
  const hasAttemptedAutoRegister = useRef(false);

  // Fetch user devices
  const {
    data: devicesData,
    isLoading: isLoadingDevices,
    refetch: refetchDevices,
  } = useDevices();

  const registerDevice = useRegisterDevice();

  // Check if user has mobile device
  const hasMobileDevice = devicesData?.devices
    ? deviceService.hasMobileDevice(devicesData.devices)
    : false;

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

  // Handle ?device=register query param on mobile
  useEffect(() => {
    const isRegisterFlow = searchParams.get('device') === 'register';

    if (
      isRegisterFlow &&
      isMobileDevice() &&
      !hasMobileDevice &&
      !isLoadingDevices &&
      !hasAttemptedAutoRegister.current
    ) {
      hasAttemptedAutoRegister.current = true;
      handleAutoRegister();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hasMobileDevice, isLoadingDevices]);

  // Show modal if no mobile device (after loading)
  useEffect(() => {
    if (!isLoadingDevices && !hasMobileDevice && !isAutoRegistering) {
      setShowNotificationModal(true);
    }
  }, [isLoadingDevices, hasMobileDevice, isAutoRegistering]);

  // Auto-register device on mobile deep-link
  const handleAutoRegister = async () => {
    setIsAutoRegistering(true);

    try {
      const result = await requestNotificationPermissionWithDetails();
      if (!result.token) {
        console.error('Auto-register notification error:', result.error);
        toast.error(
          result.errorMessage || 'Vui lòng cho phép thông báo để tiếp tục'
        );
        setShowNotificationModal(true);
        return;
      }

      const platform = /iphone|ipad|ipod/i.test(navigator.userAgent)
        ? 'ios'
        : 'android';

      await registerDevice.mutateAsync({
        fcm_token: result.token,
        platform,
        device_name: navigator.userAgent.substring(0, 50),
      });

      toast.success('Đã đăng ký thiết bị thành công!');

      // Remove query param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('device');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Auto-registration failed:', error);
      toast.error('Không thể đăng ký thiết bị. Vui lòng thử lại.');
      setShowNotificationModal(true);
    } finally {
      setIsAutoRegistering(false);
    }
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: savePracticeSchedule,
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
    // Gate: Check for mobile device
    if (!hasMobileDevice) {
      toast.error('Vui lòng đăng ký thiết bị di động trước khi lưu');
      setShowNotificationModal(true);
      return;
    }

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

  // Handle notification modal success
  const handleNotificationSuccess = () => {
    setShowNotificationModal(false);
    refetchDevices();
  };

  // Loading state while checking devices
  if (isLoadingDevices) {
    return (
      <>
        <Header className='sticky top-0 left-0 z-50 w-full' />
        <div className='flex min-h-screen items-center justify-center pt-24'>
          <LoadingOverlay isVisible message='Đang kiểm tra thiết bị...' />
        </div>
        <Footer />
      </>
    );
  }

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

        {/* Notification Gate Banner */}
        {!hasMobileDevice && (
          <div className='mx-auto mb-6 w-[82.5%]'>
            <div className='border-primary bg-primary/5 flex items-center justify-between rounded-lg border p-4'>
              <div className='flex items-center gap-3'>
                <div>
                  <p className='text-primary font-medium'>
                    Chưa có thiết bị di động
                  </p>
                  <p className='text-primary text-sm'>
                    Đăng ký thiết bị để nhận nhắc nhở tập luyện
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                onClick={() => setShowNotificationModal(true)}
                className='border-primary bg-primary/10 text-primary hover:bg-primary/20'
              >
                Đăng ký ngay
              </Button>
            </div>
          </div>
        )}

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
                onClick={() => onSubmit(form.getValues())}
                disabled={
                  submitMutation.isPending ||
                  form.formState.isSubmitting ||
                  !hasMobileDevice
                }
                className='w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto'
              >
                {submitMutation.isPending || form.formState.isSubmitting
                  ? 'Đang lưu...'
                  : hasMobileDevice
                    ? 'Lưu thiết lập'
                    : 'Đăng ký thiết bị trước'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Notification Setup Modal */}
      <NotificationSetupModal
        open={showNotificationModal}
        onOpenChange={setShowNotificationModal}
        onSuccess={handleNotificationSuccess}
      />

      <Footer />
      <LoadingOverlay
        isVisible={submitMutation.isPending || isAutoRegistering}
        message={
          isAutoRegistering
            ? 'Đang đăng ký thiết bị...'
            : 'Đang lưu thiết lập...'
        }
      />
    </>
  );
};

// Default export with Suspense
const PracticePage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProtectedRoute>
        <PracticePageContent />
      </ProtectedRoute>
    </Suspense>
  );
};

const LoadingFallback = () => (
  <>
    <Header className='sticky top-0 left-0 z-50 w-full' />
    <div className='flex min-h-screen items-center justify-center pt-24'>
      <div className='animate-pulse text-gray-500'>Đang tải...</div>
    </div>
    <Footer />
  </>
);

export default PracticePage;
