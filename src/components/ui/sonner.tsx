'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position='top-right'
      richColors
      closeButton
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg rounded-md',
          description: 'group-[.toast]:text-gray-500',
          actionButton: 'group-[.toast]:bg-blue-600 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600',
          success:
            'group-[.toast]:bg-green-50 group-[.toast]:text-green-800 group-[.toast]:border-green-200',
          error:
            'group-[.toast]:bg-red-50 group-[.toast]:text-red-800 group-[.toast]:border-red-200',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
