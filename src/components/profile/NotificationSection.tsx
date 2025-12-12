'use client';

import { Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrainingReminderList } from './TrainingReminderList';
import { Skeleton } from '@/components/ui/skeleton';
import { Schedule } from '@/types/schedule';
import type { Device } from '@/types/device';

interface NotificationSectionProps {
  reminders: Schedule | null;
  devices: Device[] | null;
  isLoadingReminders?: boolean;
  isLoadingDevices?: boolean;
  className?: string;
}

// Device type label mapping
const getDeviceTypeLabel = (deviceType: string | null): string => {
  switch (deviceType) {
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

// Format date for device
const formatDeviceDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

export const NotificationSection = ({
  reminders,
  devices,
  isLoadingReminders = false,
  isLoadingDevices = false,
  className,
}: NotificationSectionProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-[#EFEFEF] bg-white py-6 dark:bg-gray-800',
        className
      )}
    >
      <h3 className='mb-0 border-b-2 border-[#EFEFEF] px-6 pb-3 text-base font-semibold text-gray-900 dark:text-white'>
        Thông báo
      </h3>

      <div className='grid grid-cols-1 gap-6 px-6 lg:grid-cols-2'>
        {/* Training Reminders */}
        <TrainingReminderList
          reminders={reminders}
          isLoading={isLoadingReminders}
        />

        {/* Devices Section */}
        <div className='space-y-3 border-l-2 border-[#EFEFEF] pt-6 pl-6'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium text-[#B3B8C3]'>
              Thiết bị nhận
            </h4>
            <span className='text-xs text-gray-400'>
              Số lượng: {devices?.length || 0}
            </span>
          </div>

          {isLoadingDevices ? (
            <div className='space-y-2'>
              <div className='flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800'>
                <Skeleton className='h-8 w-8 rounded-lg' />
                <div className='flex-1 space-y-1'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-3 w-36' />
                </div>
              </div>
            </div>
          ) : devices?.length === 0 ? (
            <div className='rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-700/50'>
              <Smartphone className='mx-auto mb-2 h-8 w-8 text-gray-300' />
              <p className='text-xs text-gray-500'>Chưa có thiết bị đăng ký</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {devices?.map((device: Device) => (
                <div
                  key={device.id}
                  className='flex items-center gap-3 rounded-lg border border-gray-100 bg-[#F9F9FC] p-3'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EFEFEF] bg-white'>
                    <Smartphone className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium text-[#364153] dark:text-white'>
                      {device.device_name || device.device_type
                        ? getDeviceTypeLabel(device.device_type)
                        : 'Không xác định'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Hoạt động gần nhất vào lúc:{' '}
                      {formatDeviceDate(device.last_used_at || '2025-01-01')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
