import { Skeleton } from '@/components/ui/skeleton';

export const ScheduleSkeleton = () => {
  return (
    <div className='space-y-4 rounded-lg border bg-white p-4 dark:bg-gray-800/40'>
      {/* Header section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-5 w-16' />
          </div>
          <Skeleton className='h-4 w-32' />
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-6 w-10' />
        </div>
      </div>

      {/* Weekly plan grid */}
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7'>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className='h-[80px] space-y-2 rounded-md border p-2'>
            <div className='flex items-start justify-between'>
              <Skeleton className='h-3 w-8' />
              <Skeleton className='h-3 w-3 rounded-full' />
            </div>
            <div className='pt-2'>
              <Skeleton className='mb-1 h-3 w-16' />
              <Skeleton className='h-3 w-12' />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className='flex justify-end pt-2'>
        <Skeleton className='h-9 w-24' />
      </div>
    </div>
  );
};
