import React, { memo } from 'react';
import Image from 'next/image';
import { DEFAULT_AVATAR_PATH } from '@/lib/constants';
import { useAvatarError } from '@/hooks/useAvatarError';

interface AvatarProps {
  /**
   * The avatar image URL. If provided and valid, will be displayed.
   * Falls back to default avatar on error or if not provided.
   */
  src?: string | null;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * Size of the avatar in pixels (width and height)
   */
  size?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * User ID for resetting error state when user changes
   */
  userId?: string;
  /**
   * Whether to use object-cover for the image
   * @default true
   */
  cover?: boolean;
  /**
   * Whether to use rounded-full class
   * @default true
   */
  rounded?: boolean;
  /**
   * Whether this image is a priority image (above the fold)
   * When true, the image will be loaded immediately and cached aggressively
   * @default false
   */
  priority?: boolean;
}

/**
 * Reusable Avatar component with automatic error handling and fallback to default avatar.
 * Handles image loading errors gracefully and resets error state when avatar URL changes.
 * Memoized to prevent unnecessary re-renders and flickering on navigation.
 */
const AvatarComponent = ({
  src,
  alt = 'Avatar',
  size = 44,
  className = '',
  userId,
  cover = true,
  rounded = true,
  priority = false,
}: AvatarProps) => {
  const { hasError, handleError } = useAvatarError({
    avatarUrl: src,
    userId,
  });

  const displaySrc = src && !hasError ? src : DEFAULT_AVATAR_PATH;
  const imageClassName = [
    cover && 'object-cover',
    rounded && 'rounded-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Image
      src={displaySrc}
      alt={alt}
      width={size}
      height={size}
      className={imageClassName}
      priority={priority}
      unoptimized
      onError={handleError}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
// This helps prevent flickering when navigating between pages
export const Avatar = memo(AvatarComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.src === nextProps.src &&
    prevProps.userId === nextProps.userId &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    prevProps.alt === nextProps.alt &&
    prevProps.priority === nextProps.priority
  );
});

Avatar.displayName = 'Avatar';
