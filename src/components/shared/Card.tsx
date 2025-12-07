import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardProps {
  id: number;
  index: number;
  description: string;
  image: string;
}

const Card = ({ description, image, index }: CardProps) => {
  return (
    <div
      className={cn(
        'relative min-h-[200px] w-[24%] flex-shrink-0 overflow-hidden rounded-2xl bg-white',
        'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-gradient-to-b before:from-transparent before:via-black/20 before:to-black/70',
        index === 0 &&
          'before:from-emerald-50/10 before:via-teal-600/40 before:to-teal-700/80'
      )}
    >
      {index !== 1 && (
        <p className='absolute right-0 bottom-0 left-0 z-20 p-4 text-[0.85rem] font-medium text-white'>
          {description}
        </p>
      )}
      <Image
        src={image}
        alt={description}
        className='h-full w-full object-cover'
        width={300}
        height={200}
      />
    </div>
  );
};

export default Card;
