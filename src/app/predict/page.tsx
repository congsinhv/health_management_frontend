'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/auth';
import { submitPrediction } from '@/services/prediction';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import {
  alcoholOptions,
  genderOptions,
  physicalActivityOptions,
  PredictFormData,
  screenTimeOptions,
  snackOptions,
  transportationOptions,
  vegetableOptions,
  waterIntakeOptions,
  yesNoOptions,
} from './formHelper';
import { predictFormSchema } from './validation';

const PredictPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAllFields = async (form: UseFormReturn<PredictFormData>) => {
    await form.trigger();
    return Object.keys(form.formState.errors).length > 0;
  };

  const form = useForm<PredictFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(predictFormSchema) as any,
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', `${user.firstName} ${user.lastName}`);
      form.setValue('gender', user.gender === 'male' ? 1 : 0);
      form.setValue(
        'age',
        dayjs(dayjs().format('YYYY-MM-DD')).diff(
          dayjs(user.dateOfBirth),
          'year'
        )
      );
    }
  }, [user, form]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: PredictFormData) => {
    try {
      const isInvalid = await validateAllFields(form);

      if (isInvalid) {
        return;
      }

      setIsSubmitting(true);

      // Submit prediction and get result
      const result = await submitPrediction(data);
      // Store prediction_id in localStorage for appointment scheduling
      if (result.id) {
        localStorage.setItem('prediction_id', result.id);
      }

      // Store result in sessionStorage for the results page
      sessionStorage.setItem('predictionResult', JSON.stringify(result));

      // Navigate to results page
      router.push('/predict/result');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xử lý dự đoán. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  const renderGenderSelect = useCallback(
    (field: { value: number; onChange: (value: number) => void }) => {
      if (!field.value) return <></>;
      return (
        <FormItem className='min-h-[88px]'>
          <FormLabel className='text-xs font-medium text-[#6A7282]'>
            Giới tính
          </FormLabel>
          <Select
            onValueChange={value => field.onChange(parseInt(value))}
            defaultValue={field.value?.toString()}
            disabled={user?.gender !== null}
          >
            <FormControl>
              <SelectTrigger className='rounded-[4px] bg-white'>
                <SelectValue placeholder='Chọn giới tính' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {genderOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      );
    },
    []
  );

  return (
    <>
      <Header className='sticky top-0 left-0 z-50 w-full' />
      <div className='min-h-screen pt-24'>
        <div className=''>
          <div className='mb-12 text-center'>
            <h2 className='mb-2 text-5xl font-semibold text-gray-900'>
              Điền biểu mẫu sau để dự đoán sức khoẻ
            </h2>
            <p className='mx-auto max-w-3xl text-sm text-gray-600'>
              Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn cá
              nhân hoá và dự đoán nguy cơ thừa cân, béo phì Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry&apos;s standard dummy text ever since
              the 1500s
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-10 bg-[#F5F4FA] pb-22.25'
            >
              {/* Demographics */}
              <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
                <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
                  <CardTitle className='font-medium'>
                    Thông tin nhân khẩu học (Demographic Information)
                  </CardTitle>
                </CardHeader>
                <CardContent className='justify-center-center flex gap-17 px-0'>
                  <div className='w-[23%]'>
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>
                      Having an up-to-date email address attached to your
                      account is a great step toward improve account dsecutity.
                    </p>
                  </div>
                  <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='name'
                      disabled={
                        user?.firstName !== null && user?.lastName !== null
                      }
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Tên người dùng
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='VD: Nguyễn Văn A'
                              className='rounded-[4px] bg-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='gender'
                      disabled={
                        user?.firstName !== null && user?.lastName !== null
                      }
                      render={({ field }) =>
                        renderGenderSelect({
                          value: field.value,
                          onChange: field.onChange,
                        })
                      }
                    />

                    <FormField
                      control={form.control}
                      name='age'
                      disabled={user?.dateOfBirth !== null}
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Tuổi
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='VD: 20'
                              className='rounded-[4px] bg-white'
                              {...field}
                              value={field.value ?? ''}
                              onChange={e =>
                                field.onChange(parseInt(e.target.value) || null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='family_history_with_overweight'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Có người thân được chẩn đoán thừa cân/béo phì?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className='flex w-full flex-row space-y-1'
                            >
                              {yesNoOptions.map(option => (
                                <FormItem
                                  key={option.value}
                                  className='flex h-[48px] flex-2 flex-row items-center space-y-0 space-x-3 rounded-[4px] bg-white px-3.5 py-2.5 shadow-xs'
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={option.value}
                                      className='cursor-pointer'
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal'>
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='height'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Chiều cao (m)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              className='rounded-[4px] bg-white'
                              placeholder='VD: 1.70'
                              value={field.value ?? ''}
                              onChange={e =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='weight'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Cân nặng (kg)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.1'
                              className='rounded-[4px] bg-white'
                              placeholder='VD: 52'
                              value={field.value ?? ''}
                              onChange={e =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Eating habits */}
              <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
                <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
                  <CardTitle className='font-medium'>
                    Thói quen ăn uống
                  </CardTitle>
                </CardHeader>
                <CardContent className='justify-center-center flex gap-17 px-0'>
                  <div className='w-[23%]'>
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>
                      Having an up-to-date email address attached to your
                      account is a great step toward improve account dsecutity.
                    </p>
                  </div>
                  <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='FAVC'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Bạn có thường xuyên ăn thức ăn nhiều calo không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className='flex w-full flex-row space-y-1'
                            >
                              {yesNoOptions.map(option => (
                                <FormItem
                                  key={option.value}
                                  className='flex h-[48px] flex-2 flex-row items-center space-y-0 space-x-3 rounded-[4px] bg-white px-3.5 py-2.5 shadow-xs'
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={option.value}
                                      className='cursor-pointer'
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal'>
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='FCVC'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Có thường xuyên ăn rau củ không?
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn tần suất' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vegetableOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='CH2O'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Uống bao nhiêu nước mỗi ngày?
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn lượng nước' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {waterIntakeOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='NCP'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Số bữa ăn chính mỗi ngày
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              className='rounded-[4px] bg-white'
                              placeholder='3'
                              value={field.value ?? ''}
                              onChange={e =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='CAEC'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Có ăn vặt xen giữa các bữa chính không?
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn tần suất' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {snackOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Activity habits */}
              <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
                <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
                  <CardTitle className='font-semibold'>
                    Thói quen vận động và sinh hoạt
                  </CardTitle>
                </CardHeader>
                <CardContent className='justify-center-center flex gap-17 px-0'>
                  <div className='w-[23%]'>
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>
                      Having an up-to-date email address attached to your
                      account is a great step toward improve account dsecutity.
                    </p>
                  </div>
                  <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='FAF'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Có thường xuyên tập thể dục không?
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn mức độ' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {physicalActivityOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='TUE'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Mức độ sử dụng thiết bị điện tử hằng ngày
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn mức độ' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {screenTimeOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='MTRANS'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='text-xs font-medium text-[#6A7282]'>
                            Phương tiện di chuyển thường dùng
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn phương tiện' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {transportationOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Other habits */}
              <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
                <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
                  <CardTitle className='font-medium'>Thói quen khác</CardTitle>
                </CardHeader>
                <CardContent className='justify-center-center flex gap-17 px-0'>
                  <div className='w-[23%]'>
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>
                      Having an up-to-date email address attached to your
                      account is a great step toward improve account dsecutity.
                    </p>
                  </div>
                  <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='SMOKE'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='h-fit text-xs font-medium text-[#6A7282]'>
                            Bạn có hút thuốc không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className='flex w-full flex-row space-y-1'
                            >
                              {yesNoOptions.map(option => (
                                <FormItem
                                  key={option.value}
                                  className='flex h-[48px] flex-2 flex-row items-center space-y-0 space-x-3 rounded-[4px] bg-white px-3.5 py-3 shadow-xs'
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={option.value}
                                      className='cursor-pointer'
                                    />
                                  </FormControl>
                                  <FormLabel className='leading-5 font-normal'>
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='CALC'
                      render={({ field }) => (
                        <FormItem className='min-h-[88px]'>
                          <FormLabel className='h-fit text-xs font-medium text-[#6A7282]'>
                            Bạn có thường xuyên sử dụng thức uống có cồn không?
                          </FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='rounded-[4px] bg-white'>
                                <SelectValue placeholder='Chọn mức độ' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {alcoholOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className='mx-auto flex w-[82.5%] items-end justify-end gap-5'>
                <div className='h-px w-full bg-[#B3B8C3]' />
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  onClick={() => {
                    onSubmit(form.getValues());
                  }}
                  className='w-full rounded-none bg-black px-17 py-3.25 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto'
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Dự đoán'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
      <LoadingOverlay isVisible={isSubmitting} />
    </>
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

const PredictPageContent = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProtectedRoute>
        <PredictPage />
      </ProtectedRoute>
    </Suspense>
  );
};

export default PredictPageContent;
