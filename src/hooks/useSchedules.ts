import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/services/schedule';
import { toast } from 'sonner';

export const SCHEDULES_QUERY_KEY = ['schedules'];

export const useSchedules = () => {
  return useQuery({
    queryKey: SCHEDULES_QUERY_KEY,
    queryFn: scheduleService.getSchedules,
  });
};

export const useUpdateScheduleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'paused' }) =>
      scheduleService.updateScheduleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: () => {
      toast.error('Không thể cập nhật trạng thái');
    },
  });
};
