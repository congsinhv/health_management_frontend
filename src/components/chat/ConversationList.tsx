/**
 * Conversation Dropdown Component
 * Compact dropdown list showing conversation history
 */

'use client';

import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth';
import { useConversation } from '@/contexts/conversation';
import { cn } from '@/lib/utils';
import { conversationService } from '@/services/conversation';
import { ConversationResponse } from '@/types/conversation';
import { LoaderIcon, MessageCircle, Pin, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import HistoryIcon from '../icons/history';

interface ConversationListProps {
  isExpanded: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  isExpanded,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const {
    conversations,
    currentConversation,
    switchConversation,
    loadConversations,
  } = useConversation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter conversations based on search term
  useEffect(() => {
    const filtered = conversationService.searchConversations(
      conversations,
      searchTerm
    );
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  // Load conversations when dropdown opens
  useEffect(() => {
    if (user && !conversations.length) {
      setIsLoading(true);
      loadConversations({ limit: 11 }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user, conversations.length, loadConversations]);

  // Handle conversation selection
  const handleConversationSelect = async (conversationId: number) => {
    switchConversation(conversationId);

    // Navigate to chatbox if not already there
    if (pathname !== '/chatbox') {
      router.push('/chatbox');
    }
  };

  // Separate pinned and regular conversations (limit for dropdown)
  const pinnedConversations = filteredConversations
    .filter(c => c.is_pinned)
    .slice(0, 3);
  const regularConversations = filteredConversations
    .filter(c => !c.is_pinned)
    .slice(0, 10);

  const hasMoreConversations =
    filteredConversations.filter(c => c.is_pinned).length > 3 ||
    filteredConversations.filter(c => !c.is_pinned).length > 10;

  return !isExpanded ? (
    <>
      <div className='flex h-10 w-10 w-full cursor-pointer items-center justify-center transition-all duration-300 hover:scale-120'>
        <HistoryIcon />
      </div>
    </>
  ) : (
    <div className=''>
      <div
        className={`flex w-full cursor-pointer items-center gap-2 hover:bg-gray-50 ${isExpanded ? 'justify-start' : 'justify-center'} conversation-dropdown-container`}
      >
        <div className='flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-120'>
          <HistoryIcon />
        </div>
        <p>Lịch sử chat</p>
      </div>
      {/* Content */}
      <div className=''>
        <div className='flex flex-col'>
          {/* Search and New Conversation */}
          <div className='space-y-2 border-b p-3'>
            <div className='relative'>
              <Search className='absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 transform text-gray-400' />
              <Input
                placeholder='Tìm kiếm...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='h-8 pl-7 text-sm'
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className='h-full max-h-[calc(100vh-200px)] overflow-y-auto'>
            {isLoading ? (
              <div className='flex h-20 items-center justify-center'>
                <LoaderIcon
                  className={cn('text-primary size-4 animate-spin')}
                />
              </div>
            ) : (
              <>
                {/* Pinned Conversations */}
                {pinnedConversations.length > 0 && (
                  <>
                    <div className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase'>
                      Đã ghim
                    </div>
                    {pinnedConversations.map(conv => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isActive={currentConversation?.id === conv.id}
                        onSelect={handleConversationSelect}
                      />
                    ))}
                  </>
                )}

                {/* Regular Conversations */}
                {regularConversations.length > 0 && (
                  <>
                    {pinnedConversations.length > 0 && (
                      <div className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase'>
                        Gần đây
                      </div>
                    )}
                    {regularConversations.map(conv => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isActive={currentConversation?.id === conv.id}
                        onSelect={handleConversationSelect}
                      />
                    ))}
                  </>
                )}

                {/* Empty state */}
                {filteredConversations.length === 0 && !isLoading && (
                  <div className='flex h-20 flex-col items-center justify-center text-gray-500'>
                    <MessageCircle className='mb-1 h-6 w-6' />
                    <p className='px-3 text-center text-xs'>
                      {searchTerm
                        ? 'Không tìm thấy cuộc trò chuyện nào'
                        : 'Chưa có cuộc trò chuyện nào'}
                    </p>
                  </div>
                )}

                {/* Show more indicator */}
                {hasMoreConversations && (
                  <div className='px-3 py-2 text-center text-xs text-gray-500'>
                    Xem tất cả trong lịch sử...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual conversation item for dropdown
interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive?: boolean;
  onSelect: (id: number) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(conversation.id);
  };

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        isActive && 'bg-blue-50 text-blue-600',
        !isActive && 'hover:bg-gray-50'
      )}
      onClick={handleClick}
    >
      {/* Pin icon for pinned conversations */}
      {conversation.is_pinned && (
        <Pin className='h-3 w-3 flex-shrink-0 fill-current text-blue-500' />
      )}

      {/* Conversation content */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between'>
          <h4 className='text-md truncate font-medium'>
            {conversation.title || 'Không có tiêu đề'}
          </h4>
          {conversation.message_count !== undefined && (
            <span className='flex items-center gap-1 text-xs text-gray-400'>
              <MessageCircle className='h-4 w-4' />
              {conversation.message_count}
            </span>
          )}
        </div>
        <p className='truncate text-[0.625rem] text-gray-400 italic'>
          {conversationService.formatDate(
            conversation.updated_at || conversation.created_at
          )}
        </p>
      </div>
    </div>
  );
};
