import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getSchedules, updateScheduleStatus } from '../schedule';
import apiClient from '../api';

// Mock the API client
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('scheduleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSchedules', () => {
    it('should fetch schedules and filter out superseded ones', async () => {
      const mockSchedules = [
        { id: 1, status: 'active', goal: 'gain' },
        { id: 2, status: 'paused', goal: 'lose' },
        { id: 3, status: 'superseded', goal: 'maintain' },
      ];

      (apiClient.get as Mock).mockResolvedValue({
        data: mockSchedules,
      });

      const result = await getSchedules();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/schedules/');
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, status: 'active', goal: 'gain' },
        { id: 2, status: 'paused', goal: 'lose' },
      ]);
      // Should not contain the superseded schedule
      expect(result.find(s => s.id === 3)).toBeUndefined();
    });

    it('should handle empty response', async () => {
      (apiClient.get as Mock).mockResolvedValue({
        data: [],
      });

      const result = await getSchedules();

      expect(result).toHaveLength(0);
    });
  });

  describe('updateScheduleStatus', () => {
    it('should update schedule status', async () => {
      const mockResponse = {
        id: 1,
        status: 'paused',
        updated_at: '2025-12-08T10:00:00Z',
      };

      (apiClient.patch as Mock).mockResolvedValue({
        data: mockResponse,
      });

      const result = await updateScheduleStatus(1, 'paused');

      expect(apiClient.patch).toHaveBeenCalledWith('/api/v1/schedules/1/', {
        status: 'paused',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
