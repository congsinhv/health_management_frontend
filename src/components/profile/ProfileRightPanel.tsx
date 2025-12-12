'use client';

import { cn } from '@/lib/utils';
import { PredictionHistoryList } from './PredictionHistoryList';
import { NotificationSection } from './NotificationSection';
import type { Device } from '@/types/device';
import { Schedule } from '@/types/schedule';
import { TrackingItem } from '@/types/tracking';

interface ProfileRightPanelProps {
  historyItems: TrackingItem[];
  historyTotal: number;
  isLoadingHistory?: boolean;
  reminders: Schedule | null;
  devices: Device[] | null;
  isLoadingReminders?: boolean;
  isLoadingDevices?: boolean;
  onHistoryItemClick?: (item: TrackingItem) => void;
  className?: string;
}

export const ProfileRightPanel = ({
  historyItems,
  historyTotal,
  isLoadingHistory = false,
  reminders,
  devices,
  isLoadingReminders = false,
  isLoadingDevices = false,
  onHistoryItemClick,
  className,
}: ProfileRightPanelProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Prediction History */}
      <PredictionHistoryList
        items={historyItems}
        total={historyTotal}
        isLoading={isLoadingHistory}
        onItemClick={onHistoryItemClick}
      />

      {/* Notifications Section */}
      <NotificationSection
        reminders={reminders}
        devices={devices}
        isLoadingReminders={isLoadingReminders}
        isLoadingDevices={isLoadingDevices}
      />
    </div>
  );
};
