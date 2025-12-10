'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { SportBadge } from './SportBadge';
import { SportTagInput } from './SportTagInput';
import { predefinedSports } from '@/app/practice/formHelper';
import type { PracticeFormData } from '@/types/practice';

interface SportsSectionProps {
  form: UseFormReturn<PracticeFormData>;
}

export const SportsSection = ({ form }: SportsSectionProps) => {
  const selectedPredefined = form.watch('sports.predefined') || [];

  const togglePredefined = (value: string) => {
    const current = selectedPredefined;
    const newSelection = current.includes(value)
      ? current.filter(s => s !== value)
      : [...current, value];
    form.setValue('sports.predefined', newSelection);
  };

  return (
    <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
      <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
        <CardTitle className='font-medium'>Môn thể thao yêu thích</CardTitle>
      </CardHeader>
      <CardContent className='flex gap-17 px-0'>
        {/* Left description */}
        <div className='w-[23%]'>
          <h5 className='text-xl font-medium'>Sở thích</h5>
          <p className='text-sm text-gray-600'>
            Chọn các môn thể thao bạn yêu thích để cá nhân hóa đề xuất.
          </p>
        </div>

        {/* Sports content */}
        <div className='flex-1 space-y-6'>
          {/* Predefined sports grid */}
          <FormField
            control={form.control}
            name='sports.predefined'
            render={() => (
              <FormItem>
                <div
                  role='group'
                  aria-label='Chọn môn thể thao yêu thích'
                  className='flex flex-wrap gap-3'
                >
                  {predefinedSports.map(sport => (
                    <SportBadge
                      key={sport.value}
                      label={sport.label}
                      value={sport.value}
                      selected={selectedPredefined.includes(sport.value)}
                      onToggle={togglePredefined}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom sports input */}
          <FormField
            control={form.control}
            name='sports.custom'
            render={({ field }) => (
              <FormItem>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Thêm môn thể thao khác
                </label>
                <SportTagInput
                  tags={field.value || []}
                  onAdd={tag => field.onChange([...(field.value || []), tag])}
                  onRemove={tag =>
                    field.onChange((field.value || []).filter(t => t !== tag))
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { SportBadge } from './SportBadge';
export { SportTagInput } from './SportTagInput';
