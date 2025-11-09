/**
 * Shared profile form schemas
 * Reusable Zod schemas for user profile forms
 */

import * as z from 'zod';
import { VALIDATION, USER_CONSTANTS } from '@/lib/constants';

// Gender schema
export const genderSchema = z.enum(USER_CONSTANTS.GENDERS, {
  message: 'Vui lòng chọn giới tính',
});

// Goal schema
export const goalSchema = z.enum(USER_CONSTANTS.GOALS, {
  message: 'Vui lòng chọn mục tiêu',
});

// Height validation (in cm)
export const heightSchema = z
  .string()
  .min(1, 'Vui lòng nhập chiều cao')
  .refine(
    val => !isNaN(Number(val)) && Number(val) >= VALIDATION.HEIGHT.MIN,
    `Chiều cao phải lớn hơn hoặc bằng ${VALIDATION.HEIGHT.MIN}${VALIDATION.HEIGHT.UNIT}`
  )
  .refine(
    val => Number(val) <= VALIDATION.HEIGHT.MAX,
    `Chiều cao không được vượt quá ${VALIDATION.HEIGHT.MAX}${VALIDATION.HEIGHT.UNIT}`
  );

// Weight validation (in kg)
export const weightSchema = z
  .string()
  .min(1, 'Vui lòng nhập cân nặng')
  .refine(
    val => !isNaN(Number(val)) && Number(val) >= VALIDATION.WEIGHT.MIN,
    `Cân nặng phải lớn hơn hoặc bằng ${VALIDATION.WEIGHT.MIN}${VALIDATION.WEIGHT.UNIT}`
  )
  .refine(
    val => Number(val) <= VALIDATION.WEIGHT.MAX,
    `Cân nặng không được vượt quá ${VALIDATION.WEIGHT.MAX}${VALIDATION.WEIGHT.UNIT}`
  );

// Name validation
export const fullNameSchema = z
  .string()
  .min(
    VALIDATION.NAME.MIN_LENGTH,
    `Họ tên phải có ít nhất ${VALIDATION.NAME.MIN_LENGTH} ký tự`
  )
  .max(
    VALIDATION.NAME.MAX_LENGTH,
    `Họ tên không được vượt quá ${VALIDATION.NAME.MAX_LENGTH} ký tự`
  );

// Date of birth validation
export const dateOfBirthSchema = z.date({
  message: 'Vui lòng chọn ngày sinh',
});

// Profile form schema
export const profileFormSchema = z.object({
  fullName: fullNameSchema,
  gender: genderSchema,
  height: heightSchema,
  currentWeight: weightSchema,
  dateOfBirth: dateOfBirthSchema,
  underlyingConditions: z.string().optional(),
  goal: goalSchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Basic profile update schema (for settings page)
export const basicProfileSchema = z.object({
  firstName: z
    .string()
    .min(
      VALIDATION.NAME.MIN_LENGTH,
      `Tên phải có ít nhất ${VALIDATION.NAME.MIN_LENGTH} ký tự`
    ),
  lastName: z
    .string()
    .min(
      VALIDATION.NAME.MIN_LENGTH,
      `Họ phải có ít nhất ${VALIDATION.NAME.MIN_LENGTH} ký tự`
    ),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().optional(),
});

export type BasicProfileFormValues = z.infer<typeof basicProfileSchema>;
