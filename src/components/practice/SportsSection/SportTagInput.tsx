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

  return (
    <div className='space-y-3'>
      {/* Input row */}
      <div className='flex gap-2'>
        <Input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='flex-1 rounded-[4px] bg-white'
          aria-label='Thêm môn thể thao'
        />
        <Button
          type='button'
          onClick={handleAdd}
          disabled={
            inputValue.trim().length < 2 || inputValue.trim().length > 30
          }
          variant='outline'
          className='px-3'
          aria-label='Thêm'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Tags display */}
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {tags.map(tag => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center gap-1 rounded-full',
                'bg-gray-100 px-3 py-1 text-sm text-gray-700'
              )}
            >
              {tag}
              <button
                type='button'
                onClick={() => handleRemove(tag)}
                className='ml-1 rounded-full p-0.5 hover:bg-gray-200'
                aria-label={`Xóa ${tag}`}
              >
                <X className='h-3 w-3' />
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
