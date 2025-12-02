/**
 * Shared authentication form schemas
 * Reusable Zod schemas for login, register, and password reset forms
 */

import * as z from 'zod';
import { VALIDATION } from '@/lib/constants';

// Email validation schema (reusable)
export const emailSchema = z
  .string()
  .min(1, 'Email là bắt buộc')
  .email('Email không hợp lệ');

// Password validation schema (reusable)
export const passwordSchema = z
  .string()
  .min(
    VALIDATION.PASSWORD.MIN_LENGTH,
    `Mật khẩu phải có ít nhất ${VALIDATION.PASSWORD.MIN_LENGTH} ký tự`
  )
  .max(
    VALIDATION.PASSWORD.MAX_LENGTH,
    `Mật khẩu không được vượt quá ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`
  )
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số'
  );

// Name validation schema (reusable)
export const nameSchema = z
  .string()
  .min(
    VALIDATION.NAME.MIN_LENGTH,
    `Tên phải có ít nhất ${VALIDATION.NAME.MIN_LENGTH} ký tự`
  )
  .max(
    VALIDATION.NAME.MAX_LENGTH,
    `Tên không được vượt quá ${VALIDATION.NAME.MAX_LENGTH} ký tự`
  );

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Register form schema
export const registerFormSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
