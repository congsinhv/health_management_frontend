'use client';

import { cn } from '@/lib/utils';
import { PredictionHistoryList } from './PredictionHistoryList';
import { NotificationSection } from './NotificationSection';
import type { PredictionHistoryItem, TrainingReminder } from '@/types/profile';
import type { Device } from '@/types/device';
import { Schedule } from '@/types/schedule';

interface ProfileRightPanelProps {
  historyItems: PredictionHistoryItem[];
  historyTotal: number;
  isLoadingHistory?: boolean;
  reminders: Schedule | null;
  devices: Device[] | null;
  isLoadingReminders?: boolean;
  isLoadingDevices?: boolean;
  onHistoryItemClick?: (item: PredictionHistoryItem) => void;
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
