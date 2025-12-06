export const goalOptions = [
  { label: 'Tăng cân', value: 'gain' },
  { label: 'Giảm cân', value: 'lose' },
  { label: 'Giữ cân', value: 'maintain' },
];

export const dayOptions = [
  { label: 'T2', value: 'monday', fullName: 'Thứ 2' },
  { label: 'T3', value: 'tuesday', fullName: 'Thứ 3' },
  { label: 'T4', value: 'wednesday', fullName: 'Thứ 4' },
  { label: 'T5', value: 'thursday', fullName: 'Thứ 5' },
  { label: 'T6', value: 'friday', fullName: 'Thứ 6' },
  { label: 'T7', value: 'saturday', fullName: 'Thứ 7' },
  { label: 'CN', value: 'sunday', fullName: 'Chủ nhật' },
];

export const predefinedSports = [
  { label: 'Chạy bộ', value: 'running' },
  { label: 'Bơi lội', value: 'swimming' },
  { label: 'Yoga', value: 'yoga' },
  { label: 'Gym', value: 'gym' },
  { label: 'Đạp xe', value: 'cycling' },
  { label: 'Bóng đá', value: 'football' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Cầu lông', value: 'badminton' },
];

export const scheduleModeOptions = [
  { label: 'Linh hoạt', value: 'flexible' },
  { label: 'Cố định', value: 'fixed' },
];

// Calculate duration between two times
export const calculateDuration = (start: string, end: string): string => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let totalMinutes = endH * 60 + endM - (startH * 60 + startM);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}p`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}p`;
};
