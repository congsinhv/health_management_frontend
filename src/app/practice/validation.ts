import { z } from 'zod';

// Accepts HH:mm or HH:mm:ss formats
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

const timeSchema = z
  .string()
  .transform(val => {
    // Parse and normalize to HH:mm:ss format
    const match = val.match(timeRegex);
    if (!match) {
      return val; // Let refine handle invalid format
    }

    const [, hours, minutes, seconds = '00'] = match;
    return `${hours}:${minutes}:${seconds}`;
  })
  .refine(val => timeRegex.test(val), {
    message: 'Invalid time format (HH:mm or HH:mm:ss)',
  });

const timePeriodSchema = z.object({
  startTime: timeSchema,
  endTime: timeSchema,
});

// Optional time period that allows empty strings (for when not in use)
const optionalTimePeriodSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});

// Flexible time period schema - allows empty strings, validated conditionally
const flexibleTimePeriodSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
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

  // Schedule - validated conditionally based on mode
  schedule: z
    .object({
      mode: z.enum(['flexible', 'fixed']),
      selectedDays: z.array(z.string()).min(1, 'Chọn ít nhất 1 ngày'),
      // Use flexible schema that allows empty strings - validated in superRefine
      flexiblePeriods: z
        .record(z.string(), z.array(flexibleTimePeriodSchema))
        .optional(),
      // Use flexible schema that allows empty strings - validated in superRefine
      fixedPeriod: optionalTimePeriodSchema.optional(),
    })
    .superRefine((data, ctx) => {
      if (data.mode === 'fixed') {
        // Validate fixedPeriod when in fixed mode
        if (!data.fixedPeriod?.startTime || !data.fixedPeriod?.endTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Vui lòng nhập thời gian bắt đầu và kết thúc',
            path: ['fixedPeriod'],
          });
          return;
        }
        if (!timeRegex.test(data.fixedPeriod.startTime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Định dạng thời gian không hợp lệ (HH:mm)',
            path: ['fixedPeriod', 'startTime'],
          });
        }
        if (!timeRegex.test(data.fixedPeriod.endTime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Định dạng thời gian không hợp lệ (HH:mm)',
            path: ['fixedPeriod', 'endTime'],
          });
        }
      } else if (data.mode === 'flexible') {
        // Validate flexiblePeriods when in flexible mode
        const periods = data.flexiblePeriods || {};
        const selectedDays = data.selectedDays || [];

        for (const day of selectedDays) {
          const dayPeriods = periods[day];
          if (!dayPeriods || dayPeriods.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Vui lòng thêm ít nhất 1 khung giờ cho ${day}`,
              path: ['flexiblePeriods', day],
            });
          } else {
            // Validate each time period format
            dayPeriods.forEach((period, index) => {
              if (!timeRegex.test(period.startTime)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Định dạng thời gian không hợp lệ (HH:mm)',
                  path: ['flexiblePeriods', day, index, 'startTime'],
                });
              }
              if (!timeRegex.test(period.endTime)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Định dạng thời gian không hợp lệ (HH:mm)',
                  path: ['flexiblePeriods', day, index, 'endTime'],
                });
              }
            });
          }
        }
      }
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
