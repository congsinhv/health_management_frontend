import { z } from 'zod';

const timePeriodSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time'),
});

export const practiceFormSchema = z.object({
  // Basic Info
  basicInfo: z.object({
    height: z.number().optional(),
    weight: z.number().optional(),
    targetWeight: z.coerce
      .number()
      .min(30, 'Cân nặng tối thiểu 30kg')
      .max(200, 'Cân nặng tối đa 200kg'),
    goal: z.enum(['gain', 'lose', 'maintain']).optional(),
  }),

  // Schedule
  schedule: z.object({
    mode: z.enum(['flexible', 'fixed']),
    selectedDays: z.array(z.string()).min(1, 'Chọn ít nhất 1 ngày'),
    flexiblePeriods: z.record(z.string(), z.array(timePeriodSchema)).optional(),
    fixedPeriod: timePeriodSchema.optional(),
  }),

  // Sports
  sports: z.object({
    predefined: z.array(z.string()),
    custom: z.array(z.string()),
  }),

  // Notes
  notes: z.object({
    personal: z.string().max(500).optional(),
    healthWarnings: z.string().max(500).optional(),
  }),
});

// Dynamic validation for target weight based on goal
export const validateTargetWeight = (
  target: number,
  current: number,
  goal: string
): string | true => {
  switch (goal) {
    case 'gain':
      return target > current
        ? true
        : 'Mục tiêu tăng cân: cân nặng mục tiêu phải lớn hơn cân nặng hiện tại';
    case 'lose':
      return target < current
        ? true
        : 'Mục tiêu giảm cân: cân nặng mục tiêu phải nhỏ hơn cân nặng hiện tại';
    case 'maintain':
      return Math.abs(target - current) <= 1
        ? true
        : 'Mục tiêu giữ cân: cân nặng mục tiêu phải xấp xỉ cân nặng hiện tại (±1kg)';
    default:
      return true;
  }
};
