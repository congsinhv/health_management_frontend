'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { PracticeFormData } from '@/types/practice';

interface NotesSectionProps {
  form: UseFormReturn<PracticeFormData>;
}

export const NotesSection = ({ form }: NotesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className='mx-auto w-[82.5%] border-none bg-transparent pt-13.5 shadow-none'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className='border-b border-[#B3B8C3] px-0 pb-5.5'>
          <CollapsibleTrigger asChild className='cursor-pointer'>
            <button
              type='button'
              className='flex w-full items-center justify-between'
            >
              <CardTitle className='font-medium'>
                Ghi chú & Cảnh báo sức khỏe
                <span className='ml-2 text-sm font-normal text-gray-500'>
                  (Tùy chọn)
                </span>
              </CardTitle>
              {isOpen ? (
                <ChevronUp className='h-5 w-5 text-gray-500' />
              ) : (
                <ChevronDown className='h-5 w-5 text-gray-500' />
              )}
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className='flex gap-17 px-0'>
            {/* Left description */}
            <div className='w-[23%]'>
              <h5 className='text-xl font-medium'>Thông tin thêm</h5>
              <p className='text-sm text-gray-600'>
                Thêm ghi chú hoặc cảnh báo sức khỏe để chúng tôi điều chỉnh
                chương trình phù hợp.
              </p>
            </div>

            {/* Notes content */}
            <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Personal Notes */}
              <FormField
                control={form.control}
                name='notes.personal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor='personal-notes'
                      className='text-xs font-medium text-[#6A7282]'
                    >
                      Ghi chú riêng
                    </FormLabel>
                    <Textarea
                      id='personal-notes'
                      placeholder='VD: Tập nhẹ vào buổi sáng, không tập sau 9h tối...'
                      className='min-h-[100px] resize-none rounded-[4px] bg-white'
                      maxLength={500}
                      {...field}
                      value={field.value || ''}
                    />
                    <div className='flex justify-between'>
                      <FormMessage />
                      <span className='text-xs text-gray-400'>
                        {(field.value || '').length}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Health Warnings */}
              <FormField
                control={form.control}
                name='notes.healthWarnings'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor='health-warnings'
                      className='text-xs font-medium text-[#6A7282]'
                    >
                      Cảnh báo sức khỏe
                    </FormLabel>
                    <Textarea
                      id='health-warnings'
                      placeholder='VD: Đau khớp gối, huyết áp cao, dị ứng...'
                      className={cn(
                        'min-h-[100px] resize-none rounded-[4px] bg-white',
                        field.value && 'border-amber-400'
                      )}
                      maxLength={500}
                      {...field}
                      value={field.value || ''}
                    />
                    <div className='flex justify-between'>
                      <FormMessage />
                      <span className='text-xs text-gray-400'>
                        {(field.value || '').length}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
