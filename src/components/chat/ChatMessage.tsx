import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Pencil, RotateCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  onCopy?: () => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: () => void;
  isStreamingMessage?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  onEdit,
  onRegenerate,
  isStreamingMessage = false,
}) => {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    onCopy?.();

    // Reset after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = () => {
    if (
      editContent.trim() &&
      editContent.length >= 1 &&
      editContent.length <= 500
    ) {
      onEdit?.(message.id, editContent.trim());
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditContent(message.content);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const isEditValid =
    editContent.trim().length >= 1 && editContent.length <= 500;

  return (
    <div
      className={cn(
        'animate-slide-in mb-6 flex flex-col',
        isUser ? 'items-end' : 'items-start'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={cn(
          'flex items-end gap-3',
          'max-w-[70%] max-md:max-w-[85%] md:max-w-[70%]',
          isEditMode ? 'w-[80%]' : 'w-auto'
        )}
      >
        <div
          className={cn(
            'relative w-full',
            // Assistant messages - no background
            !isUser && 'border-none bg-none p-0',
            // User messages - cyan gradient pill-shaped bubble
            isUser && [
              'rounded-[24px] px-6 py-[14px] max-md:px-5 max-md:py-3',
              'bg-gradient-to-r from-[rgba(157,255,234,0.2)] to-[rgba(20,182,226,0.2)]',
              'shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] backdrop-blur-[10px]',
              'border-none',
            ]
          )}
        >
          {/* Add paragraph styling wrapper */}
          <div
            className={
              isUser
                ? ''
                : '[&_p]:m-0 [&_p]:text-[0.95rem] [&_p]:leading-[1.6] [&_p]:text-[#1e1e1e] max-md:[&_p]:text-[0.9rem]'
            }
          >
            {message.isLoading ? (
              <div className='flex gap-[0.4rem] py-2'>
                <span className='h-2 w-2 animate-bounce rounded-full bg-[#4fd1c7] [animation-delay:-0.32s]'></span>
                <span className='h-2 w-2 animate-bounce rounded-full bg-[#4fd1c7] [animation-delay:-0.16s]'></span>
                <span className='h-2 w-2 animate-bounce rounded-full bg-[#4fd1c7]'></span>
              </div>
            ) : isEditMode ? (
              <div className='flex w-full flex-col gap-3'>
                <Textarea
                  className={cn(
                    'min-h-20 w-full rounded-[18px]',
                    'text-base leading-[1.6]',
                    'resize-none'
                  )}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  maxLength={500}
                  autoFocus
                />
                <div className='flex items-center justify-between gap-3'>
                  <span
                    className={cn(
                      'text-xs font-medium text-[#999]',
                      !isEditValid && 'text-[#ef4444]'
                    )}
                  >
                    {editContent.length}/500
                  </span>
                  <div className='flex gap-2'>
                    <Button
                      variant='secondary'
                      size='default'
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant='default'
                      size='default'
                      onClick={handleSaveEdit}
                      className='bg-[#4fd1c7] text-white'
                      disabled={!isEditValid}
                    >
                      Gửi
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className='m-0 text-base leading-[1.75] break-words text-[#1e1e1e] [&>*]:inline [&>:last-child]:mb-0 [&>:last-child]:inline'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom renderers for better styling
                    p: ({ children }) => (
                      <p className='m-0 mb-4 inline leading-[1.75] last:mb-0'>
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className='font-bold text-[#1a1a1a]'>
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className='text-[#2c2c2c] italic'>{children}</em>
                    ),
                    ol: ({ children }) => (
                      <ol className='my-4 list-decimal pl-7 leading-[1.75] first:mt-0 last:mb-0'>
                        {children}
                      </ol>
                    ),
                    ul: ({ children }) => (
                      <ul className='my-4 list-disc pl-7 leading-[1.75] first:mt-0 last:mb-0'>
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className='my-2 pl-[0.375rem] leading-[1.75]'>
                        {children}
                      </li>
                    ),
                    h1: ({ children }) => (
                      <h1 className='my-5 text-[1.5rem] leading-[1.4] font-bold text-[#1a1a1a] first:mt-0 last:mb-0'>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className='my-4 text-[1.25rem] leading-[1.4] font-bold text-[#1a1a1a] first:mt-0 last:mb-0'>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className='my-[0.875rem] text-[1.1rem] leading-[1.4] font-semibold text-[#1a1a1a] first:mt-0 last:mb-0'>
                        {children}
                      </h3>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className='rounded-[4px] bg-[rgba(0,0,0,0.06)] px-[0.375rem] py-[0.125rem] font-mono text-[0.875em] font-medium text-[#e01e5a]'>
                          {children}
                        </code>
                      ) : (
                        <code className='bg-[rgba(0,0,0,0.06)] font-mono text-[0.875rem] leading-[1.6] text-[#1e1e1e]'>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className='my-4 overflow-x-auto rounded-lg bg-[rgba(0,0,0,0.06)] p-4 first:mt-0 last:mb-0 [&_code]:bg-none [&_code]:p-0'>
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className='my-4 border-l-[3px] border-[#4fd1c7] pl-4 text-[#555] italic first:mt-0 last:mb-0'>
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className='font-medium text-[#4fd1c7] no-underline hover:underline'
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <table className='my-4 w-full border-collapse [&_td]:border [&_td]:border-[#e5e5e5] [&_td]:p-2 [&_td]:text-left [&_th]:border [&_th]:border-[#e5e5e5] [&_th]:bg-[rgba(79,209,199,0.1)] [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold'>
                        {children}
                      </table>
                    ),
                    hr: () => (
                      <hr className='my-6 border-t-[1px] border-none border-[#e5e5e5]' />
                    ),
                  }}
                >
                  {!message.content &&
                  message.role === 'assistant' &&
                  !isStreamingMessage
                    ? 'Xin lỗi bạn! Dữ liệu chưa được cập nhật cho câu hỏi này.'
                    : message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {!message.isLoading && !isEditMode && !isStreamingMessage && (
        <div
          className={cn(
            'mt-2 flex flex-col gap-2',
            isUser ? 'items-end' : 'items-start'
          )}
        >
          <div
            className={cn(
              'pointer-events-none flex items-center opacity-0 transition-opacity duration-200 ease-in-out',
              showActions && 'pointer-events-auto opacity-100'
            )}
          >
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'h-8 min-w-8 gap-1 bg-transparent px-2 whitespace-nowrap text-[#666] transition-all duration-200 hover:-translate-y-px hover:border-[rgba(79,209,199,0.3)] hover:bg-[rgba(79,209,199,0.1)] hover:text-[#2c7a7b] active:translate-y-0',
                isCopied && 'bg-[rgba(79,209,199,0.15)] text-[#2c7a7b]'
              )}
              onClick={handleCopy}
              title={isCopied ? 'Đã sao chép' : 'Sao chép'}
            >
              {isCopied ? (
                <>
                  <Check className='h-4 w-4' />
                  <span className='text-xs font-medium'>Đã sao chép</span>
                </>
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>

            {isUser && onEdit && (
              <Button
                variant='ghost'
                size='sm'
                className='h-8 min-w-8 gap-1 bg-transparent px-2 whitespace-nowrap text-[#666] transition-all duration-200 hover:-translate-y-px hover:border-[rgba(79,209,199,0.3)] hover:bg-[rgba(79,209,199,0.1)] hover:text-[#2c7a7b] active:translate-y-0'
                onClick={handleEditClick}
                title='Chỉnh sửa'
              >
                <Pencil className='h-4 w-4' />
              </Button>
            )}

            {!isUser && onRegenerate && (
              <Button
                variant='ghost'
                size='sm'
                className='h-8 min-w-8 gap-1 bg-transparent px-2 whitespace-nowrap text-[#666] transition-all duration-200 hover:-translate-y-px hover:border-[rgba(79,209,199,0.3)] hover:bg-[rgba(79,209,199,0.1)] hover:text-[#2c7a7b] active:translate-y-0'
                onClick={onRegenerate}
                title='Tạo lại'
              >
                <RotateCw className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
