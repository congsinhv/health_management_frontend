import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Pencil, RotateCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import styles from './ChatMessage.module.scss';

interface ChatMessageProps {
  message: ChatMessageType;
  onCopy?: () => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  onEdit,
  onRegenerate,
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
      className={`${styles.message_wrapper} ${isUser ? styles.user : styles.assistant}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={styles.message_container}
        style={{ width: isEditMode ? '80%' : 'auto' }}
      >
        <div className={styles.message_content}>
          {message.isLoading ? (
            <div className={styles.loading_dots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : isEditMode ? (
            <div className={styles.edit_mode}>
              <Textarea
                className={styles.edit_textarea}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                onKeyDown={handleEditKeyDown}
                maxLength={500}
                autoFocus
              />
              <div className={styles.edit_footer}>
                <span
                  className={`${styles.character_count} ${!isEditValid ? styles.error : ''}`}
                >
                  {editContent.length}/500
                </span>
                <div className={styles.edit_actions}>
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
            <div className={styles.formatted_text}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom renderers for better styling
                  p: ({ children }) => (
                    <p className={styles.paragraph}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className={styles.bold}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className={styles.italic}>{children}</em>
                  ),
                  ol: ({ children }) => (
                    <ol className={styles.ordered_list}>{children}</ol>
                  ),
                  ul: ({ children }) => (
                    <ul className={styles.unordered_list}>{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className={styles.list_item}>{children}</li>
                  ),
                  h1: ({ children }) => (
                    <h1 className={styles.heading1}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className={styles.heading2}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className={styles.heading3}>{children}</h3>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className={styles.inline_code}>{children}</code>
                    ) : (
                      <code className={styles.code_block}>{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className={styles.pre_block}>{children}</pre>
                  ),
                }}
              >
                {!message.content && message.role === 'assistant'
                  ? 'Xin lỗi bạn! Dữ liệu chưa được cập nhật cho câu hỏi này.'
                  : message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {!message.isLoading && !isEditMode && (
        <div className={styles.message_footer}>
          <div
            className={cn(
              styles.message_actions,
              showActions && styles.visible
            )}
          >
            <Button
              variant='ghost'
              size='sm'
              className={cn(styles.action_button, isCopied && styles.copied)}
              onClick={handleCopy}
              title={isCopied ? 'Đã sao chép' : 'Sao chép'}
            >
              {isCopied ? (
                <>
                  <Check className='h-4 w-4' />
                  <span className={styles.button_text}>Đã sao chép</span>
                </>
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>

            {isUser && onEdit && (
              <Button
                variant='ghost'
                size='sm'
                className={styles.action_button}
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
                className={styles.action_button}
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
