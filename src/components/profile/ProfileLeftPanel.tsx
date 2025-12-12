'use client';

import { cn } from '@/lib/utils';
import { LatestPredictionCard } from './LatestPredictionCard';
import type { LatestPrediction } from '@/types/profile';
import type { ReactNode } from 'react';

interface ProfileLeftPanelProps {
  latestPrediction: LatestPrediction | null;
  isLoadingPrediction?: boolean;
  children: ReactNode; // User info form section
  className?: string;
}

export const ProfileLeftPanel = ({
  latestPrediction,
  isLoadingPrediction = false,
  children,
  className,
}: ProfileLeftPanelProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* User Profile Form Section - passed as children */}
      {children}

      {/* Latest Prediction Result */}
      <LatestPredictionCard
        prediction={latestPrediction}
        isLoading={isLoadingPrediction}
      />
    </div>
  );
};
