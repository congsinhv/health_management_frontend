'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Smartphone, Monitor, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDevices, useDeleteDevice } from '@/hooks/useDevices';
import type { Device, DevicePlatform } from '@/types/device';

// Platform icon mapping
const PlatformIcon = ({ platform }: { platform: DevicePlatform }) => {
  switch (platform) {
    case 'ios':
      return <Smartphone className='h-5 w-5 text-gray-600' />;
    case 'android':
      return <Smartphone className='h-5 w-5 text-green-600' />;
    case 'web':
      return <Monitor className='h-5 w-5 text-blue-600' />;
    default:
      return <Smartphone className='h-5 w-5 text-gray-400' />;
  }
};

// Platform label mapping
const getPlatformLabel = (platform: DevicePlatform): string => {
  switch (platform) {
    case 'ios':
      return 'iPhone/iPad';
    case 'android':
      return 'Android';
    case 'web':
      return 'Trình duyệt';
    default:
      return 'Không xác định';
  }
};

// Device list item
const DeviceItem = ({
  device,
  onDelete,
  isDeleting,
}: {
  device: Device;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => {
  const displayName = device.device_name || getPlatformLabel(device.platform);
  const registeredDate = format(new Date(device.created_at), 'dd/MM/yyyy', {
    locale: vi,
  });

  return (
    <div className='flex items-center justify-between rounded-lg border bg-white p-4 dark:bg-gray-800'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700'>
          <PlatformIcon platform={device.platform} />
        </div>
        <div>
          <p
            className='font-medium text-gray-900 dark:text-white'
            data-testid='device-name'
          >
            {displayName}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Đăng ký: {registeredDate}
          </p>
        </div>
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onDelete(device.id)}
        disabled={isDeleting}
        className='hover:text-destructive text-gray-400'
        aria-label={`Xóa thiết bị ${displayName}`}
      >
        {isDeleting ? (
          <RefreshCw className='h-4 w-4 animate-spin' />
        ) : (
          <Trash2 className='h-4 w-4' />
        )}
      </Button>
    </div>
  );
};

// Loading skeleton
const DeviceItemSkeleton = () => (
  <div
    className='flex items-center justify-between rounded-lg border bg-white p-4'
    data-testid='device-skeleton'
  >
    <div className='flex items-center gap-3'>
      <Skeleton className='h-10 w-10 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-3 w-24' />
      </div>
    </div>
    <Skeleton className='h-8 w-8' />
  </div>
);

// Empty state
const EmptyState = () => (
  <div className='flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 p-8 dark:bg-gray-800/50'>
    <Smartphone className='mb-3 h-12 w-12 text-gray-300' />
    <p className='text-center text-sm text-gray-500'>
      Chưa có thiết bị nào được đăng ký
    </p>
    <p className='text-center text-xs text-gray-400'>
      Đăng ký thiết bị tại trang Tập luyện
    </p>
  </div>
);

// Main component
export const DeviceList = () => {
  const { data, isLoading, error } = useDevices();
  const deleteDevice = useDeleteDevice();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteDevice.mutateAsync(deleteConfirmId);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  // Error state
  if (error) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600'>
        Không thể tải danh sách thiết bị. Vui lòng thử lại.
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-3'>
        <DeviceItemSkeleton />
        <DeviceItemSkeleton />
      </div>
    );
  }

  const devices = data?.devices || [];

  // Empty state
  if (devices.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className='space-y-3'>
        {devices.map(device => (
          <DeviceItem
            key={device.id}
            device={device}
            onDelete={handleDeleteClick}
            isDeleting={deleteDevice.isPending && deleteConfirmId === device.id}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thiết bị</DialogTitle>
            <DialogDescription>
              Bạn sẽ không còn nhận được thông báo trên thiết bị này. Hành động
              này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex gap-2 sm:justify-end'>
            <Button
              variant='outline'
              onClick={handleDeleteCancel}
              disabled={deleteDevice.isPending}
            >
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              disabled={deleteDevice.isPending}
            >
              {deleteDevice.isPending ? (
                <>
                  <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                  Đang xóa...
                </>
              ) : (
                'Xóa thiết bị'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
