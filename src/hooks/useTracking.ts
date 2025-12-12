/**
 * Tracking hooks for user tracking management
 * Uses React Query for server state management
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { TrackingItem } from '@/types/tracking';

export const TRACKING_QUERY_KEY = ['users', 'me', 'tracking'] as const;

export const useTracking = () => {
  return useQuery({
    queryKey: TRACKING_QUERY_KEY,
    queryFn: getTrackings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
export const getTrackings = async (): Promise<TrackingItem[]> => {
  const response = await apiClient.get<TrackingItem[]>(
    '/api/v1/users/me/tracking/'
  );
  return response.data;
};
