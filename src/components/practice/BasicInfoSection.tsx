'use client';

import {
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { goalOptions } from '@/app/practice/formHelper';
import { validateTargetWeight } from '@/app/practice/validation';
import { Lock } from 'lucide-react';
import type { PracticeFormData, UserPracticeProfile } from '@/types/practice';

interface BasicInfoSectionProps {
  form: UseFormReturn<PracticeFormData>;
  userProfile?: UserPracticeProfile;
}

export const BasicInfoSection = ({
  form,
  userProfile,
}: BasicInfoSectionProps) => {
  const hasHeight = !!userProfile?.height_cm;
  const hasWeight = !!userProfile?.weight_kg;
  const hasGoal = !!userProfile?.goal;

  // Watch for dynamic validation
  const currentWeight =
    form.watch('basicInfo.weight') || userProfile?.weight_kg;
  const currentGoal = form.watch('basicInfo.goal') || userProfile?.goal;

  return (
    <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
      <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
        <CardTitle className='font-medium'>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className='flex gap-17 px-0'>
        {/* Left description */}
        <div className='w-[23%]'>
          <h5 className='text-xl font-medium'>Mục tiêu sức khỏe</h5>
          <p className='text-sm text-gray-600'>
            Thiết lập mục tiêu cân nặng dựa trên tình trạng hiện tại của bạn.
          </p>
        </div>

        {/* Form fields */}
        <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Height */}
          <FormField
            control={form.control}
            name='basicInfo.height'
            render={({ field }) => (
              <FormItem className='min-h-[88px]'>
                <FormLabel className='flex items-center gap-1.5 text-xs font-medium text-[#6A7282]'>
                  Chiều cao (cm)
                  {hasHeight && <Lock className='h-3 w-3' />}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='VD: 170'
                    disabled={hasHeight}
                    className={cn(
                      'rounded-[4px] bg-white',
                      hasHeight && 'bg-gray-100 opacity-60'
                    )}
                    {...field}
                    value={field.value ?? userProfile?.height_cm ?? ''}
                    onChange={e => {
                      const sanitized = e.target.value.replace(/[^0-9.]/g, '');
                      field.onChange(
                        sanitized ? parseFloat(sanitized) : undefined
                      );
                    }}
                  />
                </FormControl>
                {hasHeight && (
                  <p className='text-xs text-gray-500'>Từ hồ sơ của bạn</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={form.control}
            name='basicInfo.weight'
            render={({ field }) => (
              <FormItem className='min-h-[88px]'>
                <FormLabel className='flex items-center gap-1.5 text-xs font-medium text-[#6A7282]'>
                  Cân nặng (kg)
                  {hasWeight && <Lock className='h-3 w-3' />}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.1'
                    placeholder='VD: 60'
                    disabled={hasWeight}
                    className={cn(
                      'rounded-[4px] bg-white',
                      hasWeight && 'bg-gray-100 opacity-60'
                    )}
                    {...field}
                    value={field.value ?? userProfile?.weight_kg ?? ''}
                    onChange={e => {
                      const sanitized = e.target.value.replace(/[^0-9.]/g, '');
                      field.onChange(
                        sanitized ? parseFloat(sanitized) : undefined
                      );
                    }}
                  />
                </FormControl>
                {hasWeight && (
                  <p className='text-xs text-gray-500'>Từ hồ sơ của bạn</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target Weight - Always editable */}
          <FormField
            control={form.control}
            name='basicInfo.targetWeight'
            render={({ field }) => {
              const validationResult =
                currentWeight && currentGoal
                  ? validateTargetWeight(
                      field.value || 0,
                      currentWeight,
                      currentGoal
                    )
                  : true;

              return (
                <FormItem className='min-h-[88px]'>
                  <FormLabel className='text-xs font-medium text-[#6A7282]'>
                    Mục tiêu cân nặng (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      placeholder='VD: 55'
                      className={cn(
                        'rounded-[4px] bg-white',
                        validationResult !== true && 'border-destructive'
                      )}
                      {...field}
                      value={field.value ?? ''}
                      onChange={e =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  {validationResult !== true && (
                    <p className='text-destructive text-xs'>
                      {validationResult}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Overall Goal */}
          <FormField
            control={form.control}
            name='basicInfo.goal'
            render={({ field }) => (
              <FormItem className='min-h-[88px]'>
                <FormLabel className='flex items-center gap-1.5 text-xs font-medium text-[#6A7282]'>
                  Mục tiêu tổng thể
                  {hasGoal && <Lock className='h-3 w-3' />}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || userProfile?.goal}
                  disabled={hasGoal}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        'rounded-[4px] bg-white',
                        hasGoal && 'bg-gray-100 opacity-60'
                      )}
                    >
                      <SelectValue placeholder='Chọn mục tiêu' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {goalOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasGoal && (
                  <p className='text-xs text-gray-500'>Từ hồ sơ của bạn</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
