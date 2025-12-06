'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { DayPicker } from './DayPicker';
import { FlexibleMode } from './FlexibleMode';
import { FixedMode } from './FixedMode';
import type { PracticeFormData } from '@/types/practice';

interface ScheduleSectionProps {
  form: UseFormReturn<PracticeFormData>;
}

export const ScheduleSection = ({ form }: ScheduleSectionProps) => {
  // Use watch directly - it subscribes to form changes and triggers re-renders
  const scheduleMode = form.watch('schedule.mode') || 'flexible';
  const selectedDays = form.watch('schedule.selectedDays') || [];

  return (
    <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
      <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
        <CardTitle className='font-medium'>Lịch tập luyện trong tuần</CardTitle>
      </CardHeader>
      <CardContent className='flex gap-17 px-0'>
        {/* Left description */}
        <div className='w-[23%]'>
          <h5 className='text-xl font-medium'>Lịch trình</h5>
          <p className='text-sm text-gray-600'>
            Chọn ngày và khung giờ tập luyện phù hợp với lịch trình của bạn.
          </p>
        </div>

        {/* Schedule content */}
        <div className='flex-1 space-y-6'>
          {/* Mode Toggle */}
          <FormField
            control={form.control}
            name='schedule.mode'
            render={({ field }) => (
              <FormItem>
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className='w-full'
                >
                  <TabsList
                    className='grid h-12 w-full max-w-[300px] grid-cols-2 rounded-lg border border-gray-200'
                    role='tablist'
                    aria-label='Chế độ lịch tập'
                  >
                    <TabsTrigger value='flexible'>Linh hoạt</TabsTrigger>
                    <TabsTrigger value='fixed'>Cố định</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormItem>
            )}
          />

          {/* Day Picker */}
          <FormField
            control={form.control}
            name='schedule.selectedDays'
            render={({ field }) => (
              <FormItem>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Chọn ngày tập
                </label>
                <DayPicker
                  selectedDays={field.value || []}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mode Content */}
          {scheduleMode === 'flexible' ? (
            <FormField
              control={form.control}
              name='schedule.flexiblePeriods'
              render={({ field }) => (
                <FormItem>
                  <FlexibleMode
                    selectedDays={selectedDays}
                    periods={field.value || {}}
                    onPeriodsChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name='schedule.fixedPeriod'
              render={({ field }) => (
                <FormItem>
                  <FixedMode
                    selectedDays={selectedDays}
                    period={field.value || { startTime: '', endTime: '' }}
                    onPeriodChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Re-export subcomponents for flexibility
export { DayPicker } from './DayPicker';
export { TimePeriodInput } from './TimePeriodInput';
export { FlexibleMode } from './FlexibleMode';
export { FixedMode } from './FixedMode';
