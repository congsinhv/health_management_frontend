import React from 'react';
import Image from 'next/image';
import { DEFAULT_AVATAR_PATH } from '@/lib/constants';
import { useAvatarError } from '@/hooks/useAvatarError';
import { Skeleton } from '../ui/skeleton';

interface AvatarFillProps {
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
   * Whether the image is loading
   * @default false
   */
  loading?: boolean;
}

/**
 * Avatar component that fills its container using Next.js Image fill prop.
 * Useful when avatar size is controlled by parent container.
 */
export function AvatarFill({
  src,
  alt = 'Avatar',
  className = '',
  userId,
  cover = true,
  rounded = true,
  loading = false,
}: AvatarFillProps) {
  const { hasError, handleError } = useAvatarError({
    avatarUrl: src,
    userId,
  });

  const displaySrc = src && !hasError ? src : DEFAULT_AVATAR_PATH;
  const imageClassName = [
    loading ? 'opacity-0' : 'opacity-100',
    cover && 'object-cover',
    rounded && 'rounded-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return loading ? (
    <div className={imageClassName}>
      <Skeleton className='h-full w-full rounded-full' />
    </div>
  ) : (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      className={imageClassName}
      unoptimized
      onError={handleError}
    />
  );
}
