import { Logo } from './Logo';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({
  isVisible,
  message = 'Đang xử lý...',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-2'>
        <Logo className='animate-pulse' />
        <div className='flex items-center gap-2'>
          <div className='h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]'></div>
          <div className='h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]'></div>
          <div className='h-2 w-2 animate-bounce rounded-full bg-white'></div>
        </div>
        <p className='text-lg font-medium text-white'>{message}</p>
      </div>
    </div>
  );
}
