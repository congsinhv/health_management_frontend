/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AvatarFill } from '@/components/shared/AvatarFill';
import Header from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth';
import { AVATAR_IMAGE_ACCEPT } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { validateAvatarImage } from '@/lib/utils/avatar';
import { uploadService } from '@/services/upload';
import { userService } from '@/services/user';
import { UpdateUserProfileData } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Vui lòng chọn giới tính',
  }),
  height: z
    .string()
    .min(1, 'Vui lòng nhập chiều cao')
    .refine(
      val => !isNaN(Number(val)) && Number(val) > 0,
      'Chiều cao phải là số lớn hơn 0'
    )
    .refine(val => Number(val) <= 300, 'Chiều cao không hợp lệ'),
  currentWeight: z
    .string()
    .min(1, 'Vui lòng nhập cân nặng')
    .refine(
      val => !isNaN(Number(val)) && Number(val) > 0,
      'Cân nặng phải là số lớn hơn 0'
    )
    .refine(val => Number(val) <= 500, 'Cân nặng không hợp lệ'),
  dateOfBirth: z.date({
    message: 'Vui lòng chọn ngày sinh',
  }),
  underlyingConditions: z.string().optional(),
  goal: z.enum(['lose-weight', 'gain-weight', 'maintain'], {
    message: 'Vui lòng chọn mục tiêu',
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileContent() {
  const { user, updateUserInContext } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      gender: undefined,
      height: '',
      currentWeight: '',
      dateOfBirth: undefined,
      underlyingConditions: '',
      goal: undefined,
    },
  });

  // Fetch user profile data
  const {
    data: userData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchUserProfile,
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => userService.getProfile(Number(user?.id)),
    enabled: user?.id !== null,
  });

  // Update form when userData is loaded
  useEffect(() => {
    if (!userData) {
      setIsLoading(false);
      return;
    }

    // Extract profile data from profile object
    const profile = userData.profile;
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    const avatarUrl = profile?.avatar_url;
    const fullName = `${firstName} ${lastName}`.trim() || '';

    // Map goal from API to form enum values
    const goalValue = profile?.goal;
    let goalEnum: 'lose-weight' | 'gain-weight' | 'maintain' | undefined;
    if (goalValue) {
      const goalLower = goalValue.toLowerCase();
      if (goalLower.includes('giảm') || goalLower.includes('lose')) {
        goalEnum = 'lose-weight';
      } else if (goalLower.includes('tăng') || goalLower.includes('gain')) {
        goalEnum = 'gain-weight';
      } else if (
        goalLower.includes('duy trì') ||
        goalLower.includes('maintain')
      ) {
        goalEnum = 'maintain';
      }
    }
    updateUserInContext({
      profilePicture: avatarUrl || '',
    });

    setAvatarPreview(avatarUrl || null);

    // Map API data to form values
    form.reset({
      fullName: fullName || '',
      gender: profile?.gender as 'male' | 'female' | 'other' | undefined,
      height: profile?.height_cm ? String(profile.height_cm) : '',
      currentWeight: profile?.weight_kg ? String(profile.weight_kg) : '',
      dateOfBirth: profile?.date_of_birth
        ? new Date(profile.date_of_birth)
        : undefined,
      underlyingConditions: profile?.family_medical_history || '',
      goal: goalEnum,
    });

    setIsLoading(false);
  }, [userData]);

  // Handle loading and error states
  useEffect(() => {
    setIsLoading(isLoadingProfile);
  }, [isLoadingProfile]);

  useEffect(() => {
    if (profileError) {
      logger.error(
        'Failed to fetch user profile',
        profileError instanceof Error
          ? profileError
          : new Error('Unknown profile error')
      );
      toast.error('Không thể tải thông tin profile');
    }
  }, [profileError]);

  // Cleanup preview URL on unmount or when new file is selected
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  async function onSubmit(data: ProfileFormValues) {
    if (user?.id === null) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload avatar if a new file is selected
      let avatarUrl: string | undefined;
      if (selectedAvatarFile) {
        try {
          const uploadedUrl = await uploadAvatarFile();
          avatarUrl = uploadedUrl || undefined;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Không thể upload ảnh đại diện';
          toast.error(errorMessage);
          throw error;
        }
      }

      // Parse full name into first_name and last_name
      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Format date_of_birth to YYYY-MM-DD
      const dateOfBirth = data.dateOfBirth
        ? new Date(
            data.dateOfBirth.getTime() -
              data.dateOfBirth.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split('T')[0]
        : undefined;

      // Map goal values
      const goalMap: Record<string, string> = {
        'lose-weight': 'Giảm cân',
        'gain-weight': 'Tăng cân',
        maintain: 'Duy trì',
      };
      const goalValue = data.goal ? goalMap[data.goal] || data.goal : undefined;

      // Prepare update data
      const updateData: UpdateUserProfileData = {
        first_name: firstName,
        last_name: lastName,
        gender: data.gender,
        height_cm: data.height ? parseFloat(data.height) : undefined,
        weight_kg: data.currentWeight
          ? parseFloat(data.currentWeight)
          : undefined,
        date_of_birth: dateOfBirth,
        family_medical_history: data.underlyingConditions || undefined,
        goal: goalValue,
      };

      // Add avatar URL if uploaded
      if (avatarUrl) {
        updateData.avatar_url = avatarUrl;
      }

      await userService.updateProfile(Number(user?.id), updateData);

      refetchUserProfile();
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      logger.error(
        'Failed to update profile',
        error instanceof Error
          ? error
          : new Error('Unknown profile update error')
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Không thể cập nhật thông tin profile';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAvatarFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateAvatarImage(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'File không hợp lệ');
      return;
    }

    // Clean up previous preview URL if it exists
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    // Store the file
    setSelectedAvatarFile(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }

  async function uploadAvatarFile(): Promise<string | null> {
    if (!selectedAvatarFile || user?.id === null) {
      return null;
    }

    try {
      // Upload image to GCS
      const uploadResult = await uploadService.uploadImage(
        selectedAvatarFile,
        'avatars'
      );
      return uploadResult.url;
    } catch (error) {
      logger.error(
        'Failed to upload avatar',
        error instanceof Error
          ? error
          : new Error('Unknown avatar upload error')
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Không thể upload ảnh đại diện';
      throw new Error(errorMessage);
    }
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      {/* Header */}
      <Header />

      {/* Section 1: Heading and Description */}
      <section className='container mx-auto px-4 py-12'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-4 text-5xl font-semibold text-[#1e1e1e] dark:text-white'>
            Thông tin cá nhân
          </h1>
          <p className='mx-auto max-w-2xl text-[0.85rem] leading-relaxed text-[#1e1e1e] dark:text-gray-300'>
            Cập nhật thông tin cá nhân và sức khỏe của bạn để nhận được các gợi
            ý chế độ ăn cá nhân hóa và dự đoán nguy cơ sức khỏe phù hợp nhất.
          </p>
        </div>
      </section>

      {/* Section 2: Form with F5F4FA background */}
      <section className='bg-[#f5f4fa] py-12 dark:bg-gray-950'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='mx-auto max-w-5xl space-y-12'>
            {/* Profile Photo Section */}
            <div className='rounded-lg bg-white p-6 dark:bg-gray-800'>
              <h2 className='mb-4 text-base font-medium text-[#1e1e1e] dark:text-white'>
                Ảnh đại diện
              </h2>
              <div className='flex flex-col items-center gap-4'>
                <div className='relative h-32 w-32'>
                  <AvatarFill
                    src={avatarPreview || user?.profilePicture}
                    alt='Avatar Preview'
                    className='shadow-lg'
                    userId={user?.id?.toString()}
                    loading={isLoading}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={AVATAR_IMAGE_ACCEPT}
                  onChange={handleAvatarFileSelect}
                  className='hidden'
                />
                <Button
                  variant='outline'
                  size='sm'
                  className='border-[#d9d9d9]'
                  disabled={isLoading || isSubmitting}
                  onClick={handleAvatarClick}
                >
                  {selectedAvatarFile ? 'Đã chọn ảnh' : 'Đổi ảnh'}
                </Button>
                {selectedAvatarFile && (
                  <p className='text-xs text-gray-500'>
                    Ảnh sẽ được cập nhật khi bạn nhấn nút &quot;Cập nhật&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Personal Information Form */}
            <div className='rounded-lg bg-white p-6 dark:bg-gray-800'>
              <h2 className='mb-6 text-base font-medium text-[#1e1e1e] dark:text-white'>
                Thông tin cá nhân
              </h2>
              {isLoading ? (
                <div className='space-y-6'>
                  {/* Loading skeleton */}
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-48' />
                    <Skeleton className='h-24 w-full' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                  <div className='flex justify-end pt-4'>
                    <Skeleton className='h-10 w-[182px]' />
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    {/* Full Name & Gender */}
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ tên</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập họ và tên' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='gender'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới tính</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Chọn giới tính' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='male'>Nam</SelectItem>
                                <SelectItem value='female'>Nữ</SelectItem>
                                <SelectItem value='other'>Khác</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Height & Weight */}
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='height'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chiều cao</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  type='number'
                                  placeholder='175'
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value)}
                                  className='[appearance:textfield] pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                                />
                                <span className='absolute top-1/2 right-3 -translate-y-1/2 text-[0.85rem] text-gray-500 dark:text-gray-400'>
                                  cm
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='currentWeight'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cân nặng</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  type='number'
                                  step='0.1'
                                  placeholder='70.5'
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value)}
                                  className='[appearance:textfield] pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                                />
                                <span className='absolute top-1/2 right-3 -translate-y-1/2 text-[0.85rem] text-gray-500 dark:text-gray-400'>
                                  kg
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name='dateOfBirth'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày sinh</FormLabel>
                          <FormControl>
                            <DatePicker
                              placeholder='Chọn ngày sinh'
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Underlying Conditions */}
                    <FormField
                      control={form.control}
                      name='underlyingConditions'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiền sử bệnh của gia đình</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Nhập các bệnh nền nếu có (ví dụ: tiểu đường, tim mạch...)'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Goal */}
                    <FormField
                      control={form.control}
                      name='goal'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mục tiêu</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Chọn mục tiêu' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='lose-weight'>
                                Giảm cân
                              </SelectItem>
                              <SelectItem value='gain-weight'>
                                Tăng cân
                              </SelectItem>
                              <SelectItem value='maintain'>Duy trì</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className='flex justify-end pt-4'>
                      <Button
                        type='submit'
                        size='lg'
                        className='h-10 min-w-[182px] rounded bg-gradient-to-r from-[#32f6b4] to-[#14b6e2] text-[0.85rem] font-semibold text-white hover:opacity-90'
                        disabled={isSubmitting || form.formState.isSubmitting}
                      >
                        {isSubmitting || form.formState.isSubmitting
                          ? 'Đang lưu...'
                          : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
