'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SportTagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

export const SportTagInput = ({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Nhập môn thể thao khác...',
}: SportTagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();

    // Input validation
    if (trimmed.length < 2) return;
    if (trimmed.length > 30) return; // Max 30 characters
    if (tags.includes(trimmed)) return;

    // Sanitize input - remove HTML/script tags
    const sanitized = trimmed.replace(/<[^>>]*>/g, '').trim();
    if (sanitized !== trimmed) return; // Reject if HTML was removed

    // Only allow letters, numbers, spaces and common Vietnamese characters
    if (
      !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/.test(
        sanitized
      )
    ) {
      return;
    }

    onAdd(sanitized);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (tag: string) => {
    onRemove(tag);
    inputRef.current?.focus();
  };

  const isValidInput =
    inputValue.trim().length >= 2 && inputValue.trim().length <= 30;

  return (
    <div className='space-y-4'>
      {/* Input row - styled consistently with other form elements */}
      <div className='flex gap-3'>
        <Input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='h-12 flex-1 rounded-lg border-gray-200 bg-white'
          aria-label='Thêm môn thể thao'
        />
        <Button
          type='button'
          onClick={handleAdd}
          disabled={!isValidInput}
          className={cn(
            'h-12 rounded-lg px-5!',
            isValidInput
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-gray-100 text-gray-400'
          )}
          aria-label='Thêm'
        >
          Thêm
        </Button>
      </div>

      {/* Tags display - styled like badges */}
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {tags.map(tag => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center gap-2 rounded-full',
                'border-primary/20 bg-primary/5 text-muted-foreground border px-4 py-2 text-sm font-medium'
              )}
            >
              {tag}
              <button
                type='button'
                onClick={() => handleRemove(tag)}
                className='hover:bg-primary/10 hover:text-primary cursor-pointer rounded-full p-0.5 text-gray-400 transition-colors'
                aria-label={`Xóa ${tag}`}
              >
                <X className='h-4 w-4' />
              </button>
              <span className='sr-only' aria-live='polite'>
                Đã xóa {tag}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
