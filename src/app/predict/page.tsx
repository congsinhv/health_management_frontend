'use client';

import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { usePredictForm } from './usePredictForm';
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
import { Button } from '@/components/ui/button';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  alcoholOptions,
  genderOptions,
  physicalActivityOptions,
  screenTimeOptions,
  snackOptions,
  transportationOptions,
  vegetableOptions,
  waterIntakeOptions,
  yesNoOptions,
} from './formHelper';
import { formatFormDataForAPI } from './validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictFormSchema } from './validation';
import { initialFormData, PredictFormData } from './formHelper';

const PredictPage = () => {
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
    console.log('Form submitted with data:', form.getValues());
    return onSubmit(form.getValues());
  };

  const onSubmit = async (data: any) => {
    try {
      console.log('Form submitted with data:', data);
      const formattedData = formatFormDataForAPI(data);
      console.log('Formatted data for API:', formattedData);

      // TODO: Add API call here

      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <>
      <Header className="sticky top-0 left-0 w-full z-50" />
      <div className="min-h-screen pt-24">
        <div className="">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-semibold text-gray-900 mb-2">
              Điền biểu mẫu sau để dự đoán sức khoẻ
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm">
              Trò chuyện trực tiếp với trợ lý sức khỏe, nhận gợi ý chế độ ăn cá
              nhân hoá và dự đoán nguy cơ thừa cân, béo phì Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 bg-[#F5F4FA] pb-[5.5625rem]">
              {/* Demographics */}
              <Card className='bg-transparent w-[82.5%] mx-auto shadow-none border-none pt-[3.375rem]'>
                <CardHeader className='pb-[1.375rem] border-b-[1px] border-[#B3B8C3] px-0'>
                  <CardTitle className="font-medium">
                    Thông tin nhân khẩu học (Demographic Information)
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0 flex justify-center-center gap-[4.25rem]'>
                  <div className="w-[23%]">
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>Having an up-to-date email address attached to your account is a great step toward improve account dsecutity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Tên người dùng</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="VD: Nguyễn Văn A"
                              className='bg-white rounded-[4px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Giới tính</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='bg-white rounded-[4px]'
                              >
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genderOptions.map((option) => (
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
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Tuổi</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="VD: 20"
                              className='bg-white rounded-[4px]'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="family_history_with_overweight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>
                            Có người thân được chẩn đoán thừa cân/béo phì?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-row space-y-1 w-full"
                            >
                              {yesNoOptions.map((option) => (
                                <FormItem
                                  key={option.value}
                                  className="flex items-center space-x-3 space-y-0 bg-white rounded-[4px] flex-2 h-full px-[0.875rem] py-[0.625rem]"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option.value}
                                      className='cursor-pointer'
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
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
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Chiều cao (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              className='bg-white rounded-[4px]'
                              placeholder="VD: 1.65"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Cân nặng (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              className='bg-white rounded-[4px]'
                              placeholder="VD: 52"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
              <Card className='bg-transparent w-[82.5%] mx-auto shadow-none border-none pt-[3.375rem]'>
                <CardHeader className='pb-[1.375rem] border-b-[1px] border-[#B3B8C3] px-0'>
                  <CardTitle className="font-medium">
                    Thói quen ăn uống
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0 flex justify-center-center gap-[4.25rem]'>
                  <div className="w-[23%]">
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>Having an up-to-date email address attached to your account is a great step toward improve account dsecutity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <FormField
                      control={form.control}
                      name="FAVC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>
                            Bạn có thường xuyên ăn thức ăn nhiều calo không?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-row space-y-1 w-full"
                            >
                              {yesNoOptions.map((option) => (
                                <FormItem
                                  key={option.value}
                                  className="flex items-center space-x-3 space-y-0 bg-white rounded-[4px] flex-2 h-full px-[0.875rem] py-[0.625rem]"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option.value} className='cursor-pointer' />
                                  </FormControl>
                                  <FormLabel className="font-normal">
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
                      name="FCVC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Có thường xuyên ăn rau củ không?</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-white rounded-[4px]'>
                                <SelectValue placeholder="Chọn tần suất" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vegetableOptions.map((option) => (
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
                      name="CH2O"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Uống bao nhiêu nước mỗi ngày?</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-white rounded-[4px]'>
                                <SelectValue placeholder="Chọn lượng nước" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {waterIntakeOptions.map((option) => (
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
                      name="NCP"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Số bữa ăn chính mỗi ngày</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className='bg-white rounded-[4px]'
                              placeholder="3"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="CAEC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>
                            Có ăn vặt xen giữa các bữa chính không?
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='bg-white rounded-[4px]'
                              >
                                <SelectValue placeholder="Chọn tần suất" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {snackOptions.map((option) => (
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
              <Card className='bg-transparent w-[82.5%] mx-auto shadow-none border-none pt-[3.375rem]'>
                <CardHeader className='pb-[1.375rem] border-b-[1px] border-[#B3B8C3] px-0'>
                  <CardTitle className="font-semibold">
                    Thói quen vận động và sinh hoạt
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0 flex justify-center-center gap-[4.25rem]'>
                  <div className="w-[23%]">
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>Having an up-to-date email address attached to your account is a great step toward improve account dsecutity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <FormField
                      control={form.control}
                      name="FAF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Có thường xuyên tập thể dục không?</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-white rounded-[4px]'>
                                <SelectValue placeholder="Chọn mức độ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {physicalActivityOptions.map((option) => (
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
                      name="TUE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>
                            Mức độ sử dụng thiết bị điện tử hằng ngày
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-white rounded-[4px]'>
                                <SelectValue placeholder="Chọn mức độ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {screenTimeOptions.map((option) => (
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
                      name="MTRANS"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium'>Phương tiện di chuyển thường dùng</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-white rounded-[4px]'>
                                <SelectValue placeholder="Chọn phương tiện" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {transportationOptions.map((option) => (
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
              <Card className='bg-transparent w-[82.5%] mx-auto shadow-none border-none pt-[3.375rem]'>
                <CardHeader className='pb-[1.375rem] border-b-[1px] border-[#B3B8C3] px-0'>
                  <CardTitle className="font-medium">Thói quen khác</CardTitle>
                </CardHeader>
                <CardContent className='px-0 flex justify-center-center gap-[4.25rem]'>
                  <div className="w-[23%]">
                    <h5 className='text-xl font-medium'>Basic</h5>
                    <p>Having an up-to-date email address attached to your account is a great step toward improve account dsecutity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start">
                    <FormField
                      control={form.control}
                      name="SMOKE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium h-fit'>Bạn có hút thuốc không?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-row space-y-1 w-full"
                            >
                              {yesNoOptions.map((option) => (
                                <FormItem
                                  key={option.value}
                                  className="flex items-center space-x-3 space-y-0 bg-white rounded-[4px] flex-2 h-full px-[0.875rem] py-[0.75rem]"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option.value} className='cursor-pointer' />

                                  </FormControl>
                                  <FormLabel className="font-normal leading-[1.25rem]">
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
                      name="CALC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[#6A7282] text-xs font-medium h-fit'>
                            Bạn có thường xuyên sử dụng thức uống có cồn không?
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='bg-white rounded-[4px]'
                              >
                                <SelectValue placeholder="Chọn mức độ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {alcoholOptions.map((option) => (
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

              <div className="flex justify-end items-end w-[82.5%] mx-auto gap-[1.25rem]">
                <div className="w-full h-[1px] bg-[#B3B8C3]" />
                <Button
                  type="submit"
                  onClick={() => handleSubmit(onSubmit)}
                  disabled={form.formState.isSubmitting}
                  className="w-full md:w-auto px-[4.25rem] py-[0.8125rem] bg-black text-white rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? 'Đang xử lý...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictPage;
