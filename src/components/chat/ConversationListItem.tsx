/**
 * Conversation List Item Component
 * Individual conversation item in conversation list
 */

'use client';

import React, { useState } from 'react';
import { ConversationResponse } from '@/types/conversation';
import { conversationService } from '@/services/conversation';
import { useConversation } from '@/contexts/conversation';
import { Pin, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ConversationListItemProps {
  conversation: ConversationResponse;
  isActive?: boolean;
  onSelect?: (id: number) => void;
  isExpanded?: boolean;
  showActions?: boolean;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isActive,
  onSelect,
  isExpanded,
  showActions = true,
}) => {
  const { deleteConversation, updateConversation, switchConversation } =
    useConversation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(conversation.id);
    } else {
      switchConversation(conversation.id);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateConversation(conversation.id, {
        is_pinned: !conversation.is_pinned,
      });

      toast.success(
        conversation.is_pinned
          ? 'Đã bỏ ghim cuộc trò chuyện'
          : 'Đã ghim cuộc trò chuyện'
      );
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      toast.error('Không thể cập nhật trạng thái ghim');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDeleting) return;

    if (window.confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      setIsDeleting(true);
      try {
        await deleteConversation(conversation.id);
        toast.success('Đã xóa cuộc trò chuyện');
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        toast.error('Không thể xóa cuộc trò chuyện');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors',
        isActive && 'border-l-4 border-blue-500 bg-blue-50',
        !isActive && 'hover:bg-gray-100',
        (isDeleting || isUpdating) && 'opacity-50'
      )}
      onClick={handleSelect}
    >
      {/* Pin icon for pinned conversations */}
      {conversation.is_pinned && (
        <Pin className='h-3 w-3 flex-shrink-0 fill-current text-blue-500' />
      )}

      {/* Conversation content */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between'>
          <h4 className='truncate font-medium'>
            {conversation.title || 'Không có tiêu đề'}
          </h4>
          {isExpanded && conversation.message_count !== undefined && (
            <span className='flex items-center gap-1 text-xs text-gray-500'>
              <MessageCircle className='h-3 w-3' />
              {conversation.message_count}
            </span>
          )}
        </div>
        <p className='truncate text-xs text-gray-500'>
          {conversationService.formatDate(
            conversation.updated_at || conversation.created_at
          )}
        </p>
      </div>

      {/* Action buttons */}
      {showActions && isExpanded && (
        <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleTogglePin}
            disabled={isUpdating}
            className='h-6 w-6 p-0'
            title={conversation.is_pinned ? 'Bỏ ghim' : 'Ghim'}
          >
            <Pin
              className={cn(
                'h-3 w-3',
                conversation.is_pinned
                  ? 'fill-current text-blue-500'
                  : 'text-gray-400'
              )}
            />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDelete}
            disabled={isDeleting}
            className='h-6 w-6 p-0 text-red-500 hover:text-red-600'
            title='Xóa cuộc trò chuyện'
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      )}
    </div>
  );
};
