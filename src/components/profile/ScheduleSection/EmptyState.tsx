import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const EmptyState = () => (
  <div className='flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 p-8 dark:bg-gray-800/50'>
    <Calendar className='mb-3 h-12 w-12 text-gray-300' />
    <p className='mb-4 text-center text-sm text-gray-500'>
      Chưa có kế hoạch tập luyện nào được tạo.
    </p>
    <Button asChild variant='outline' size='sm'>
      <Link href='/practice'>Tạo kế hoạch tập luyện</Link>
    </Button>
  </div>
);
