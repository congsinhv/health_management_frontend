'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps
  extends Omit<
    React.ComponentProps<'button'>,
    'value' | 'onChange' | 'type' | 'children'
  > {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
}

function DatePicker({
  id,
  className,
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  'aria-invalid': ariaInvalid,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const calendarId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          role='combobox'
          id={id}
          data-slot='input'
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-expanded={open}
          aria-controls={open ? calendarId : undefined}
          className={cn(
            'file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-[10px] border bg-[#f7f7f7] px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#717182] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            'flex cursor-pointer items-center gap-2 text-left',
            !value && 'text-[#717182]',
            className
          )}
          {...props}
        >
          <CalendarIcon className='text-muted-foreground size-4 shrink-0' />
          <span className='flex-1 truncate'>
            {value
              ? value.toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                })
              : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start' id={calendarId}>
        <Calendar
          mode='single'
          selected={value}
          defaultMonth={value}
          onSelect={date => {
            onChange?.(date);
            setOpen(false);
          }}
          captionLayout='dropdown'
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
