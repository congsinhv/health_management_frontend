/**
 * Conversation Switcher Component
 * Dropdown for selecting and creating conversations
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ConversationResponse } from '@/types/conversation';
import { useConversation } from '@/contexts/ConversationContext';
import { conversationService } from '@/services/conversation';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ConversationSwitcherProps {
  currentConversation?: ConversationResponse | null;
  onConversationSelect?: (conversation: ConversationResponse) => void;
  onNewConversation?: () => void;
}

export const ConversationSwitcher: React.FC<ConversationSwitcherProps> = ({
  currentConversation,
  onConversationSelect,
  onNewConversation,
}) => {
  const { conversations, isLoading } = useConversation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter conversations based on search term
  const filteredConversations = conversationService.searchConversations(
    conversations,
    searchTerm
  );

  // Sort conversations: pinned first, then by recent activity
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // Pinned conversations come first
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }
    // Then by updated date (most recent first)
    return (
      new Date(b.updated_at || b.created_at).getTime() -
      new Date(a.updated_at || a.created_at).getTime()
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConversationSelect = (conversation: ConversationResponse) => {
    setIsOpen(false);
    setSearchTerm('');
    onConversationSelect?.(conversation);
  };

  const handleNewConversation = () => {
    setIsOpen(false);
    setSearchTerm('');
    onNewConversation?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <Button
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
        className='h-auto w-full justify-between p-3 text-left'
        disabled={isLoading}
      >
        <div className='flex min-w-0 flex-1 flex-col items-start'>
          <span className='w-full truncate font-medium'>
            {currentConversation?.title || 'Cuộc trò chuyện mới'}
          </span>
          {currentConversation && (
            <span className='text-muted-foreground text-xs'>
              {conversationService.formatDate(
                currentConversation.updated_at || currentConversation.created_at
              )}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
        />
      </Button>

      {isOpen && (
        <div className='bg-background absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-hidden rounded-lg border shadow-lg'>
          {/* Search bar */}
          <div className='border-b p-3'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Tìm kiếm cuộc trò chuyện...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='pl-10'
                autoFocus
              />
            </div>
          </div>

          {/* New conversation button */}
          <div className='border-b p-2'>
            <Button
              variant='ghost'
              onClick={handleNewConversation}
              className='h-8 w-full justify-start'
            >
              <Plus className='mr-2 h-4 w-4' />
              Tạo cuộc trò chuyện mới
            </Button>
          </div>

          {/* Conversation list */}
          <div className='max-h-64 overflow-y-auto'>
            {sortedConversations.length === 0 ? (
              <div className='text-muted-foreground p-4 text-center'>
                {searchTerm ? (
                  <>
                    <p className='text-sm'>
                      Không tìm thấy cuộc trò chuyện nào
                    </p>
                    <p className='mt-1 text-xs'>
                      Thử tìm kiếm với từ khóa khác
                    </p>
                  </>
                ) : (
                  <>
                    <p className='text-sm'>Chưa có cuộc trò chuyện nào</p>
                    <p className='mt-1 text-xs'>
                      Bắt đầu trò chuyện để thấy lịch sử
                    </p>
                  </>
                )}
              </div>
            ) : (
              sortedConversations.map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={cn(
                    'hover:bg-accent w-full p-3 text-left transition-colors',
                    'border-b last:border-b-0',
                    currentConversation?.id === conversation.id && 'bg-accent'
                  )}
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2 truncate font-medium'>
                        {conversation.title || 'Không có tiêu đề'}
                        {conversation.is_pinned && (
                          <span className='bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs'>
                            Đã ghim
                          </span>
                        )}
                      </div>
                      <div className='text-muted-foreground mt-1 text-xs'>
                        {conversationService.formatDate(
                          conversation.updated_at || conversation.created_at
                        )}
                        {conversation.message_count && (
                          <span className='ml-2'>
                            {conversation.message_count} tin nhắn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
