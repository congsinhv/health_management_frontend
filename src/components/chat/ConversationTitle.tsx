/**
 * Conversation Title Component
 * Editable title for conversations
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConversationResponse } from '@/types/conversation';
import { useConversation } from '@/contexts/ConversationContext';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ConversationTitleProps {
  conversation?: ConversationResponse | null;
  className?: string;
}

export const ConversationTitle: React.FC<ConversationTitleProps> = ({
  conversation,
  className,
}) => {
  const { updateConversation } = useConversation();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation?.title || '');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update title when conversation changes
  useEffect(() => {
    setTitle(conversation?.title || '');
  }, [conversation]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!conversation) return;

    const newTitle = title.trim();
    if (newTitle === conversation.title) {
      setIsEditing(false);
      return;
    }

    if (!newTitle) {
      setTitle(conversation.title || '');
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateConversation(conversation.id, { title: newTitle });
      toast.success('Đã cập nhật tiêu đề cuộc trò chuyện');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update conversation title:', error);
      toast.error('Không thể cập nhật tiêu đề cuộc trò chuyện');
      setTitle(conversation.title || '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(conversation?.title || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!conversation) {
    return (
      <div className={cn('text-lg font-semibold', className)}>
        Cuộc trò chuyện mới
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className='text-lg font-semibold'
          placeholder='Nhập tiêu đề...'
          disabled={isLoading}
        />
        <div className='flex gap-1'>
          <Button
            size='sm'
            variant='ghost'
            onClick={handleSave}
            disabled={isLoading}
          >
            <Check className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h2
        className='hover:text-muted-foreground cursor-pointer text-lg font-semibold transition-colors'
        onClick={handleEdit}
        title='Nhấp để chỉnh sửa tiêu đề'
      >
        {conversation.title || 'Không có tiêu đề'}
      </h2>
      <Button
        variant='ghost'
        size='sm'
        onClick={handleEdit}
        className='h-6 w-6 p-0 opacity-0 transition-opacity hover:opacity-100'
        title='Chỉnh sửa tiêu đề'
      >
        <Edit2 className='h-3 w-3' />
      </Button>
    </div>
  );
};
