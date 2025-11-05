import { z } from 'zod';
import type { TFunction } from 'i18next';

// Factory function to create email schema with translations
export const createEmailSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('validation:errors.email.required'))
    .email({ message: t('validation:errors.email.invalid') })
    .toLowerCase()
    .trim();

// ========================================
// REUSABLE PASSWORD SCHEMAS
// ========================================

/**
 * Strong Password Schema - Used across all auth operations
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * Used in: Registration, Reset Password
 */
export const createStrongPasswordSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('validation:errors.password.required'))
    .min(8, t('validation:errors.password.minLength', { min: 8 }))
    .max(100, t('validation:errors.password.maxLength', { max: 100 }))
    .regex(/[A-Z]/, t('validation:errors.password.uppercase'))
    .regex(/[a-z]/, t('validation:errors.password.lowercase'))
    .regex(/[0-9]/, t('validation:errors.password.number'))
    .regex(/[^A-Za-z0-9]/, t('validation:errors.password.special'));

/**
 * Basic Password Schema - For login only (no strength requirements)
 * Used when we just need to validate that a password was entered
 */
export const createBasicPasswordSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('validation:errors.password.required'));

// Factory function to create login schema with translations
export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: createEmailSchema(t),
    userName: z.string().min(1, t('validation:errors.username.required')),
    password: createBasicPasswordSchema(t),
    rememberMe: z.boolean().optional(),
  });

// Export type (inferred from return type of factory function)
export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

// ========================================
// FORGOT PASSWORD SCHEMA
// ========================================

/**
 * Forgot Password Form Schema
 * Used to validate email and username input on forgot password page
 * Both are required since one account can have multiple users
 */
export const createForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: createEmailSchema(t),
    userName: z.string().min(1, t('validation:errors.username.required')),
  });

export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

// ========================================
// RESET PASSWORD SCHEMA
// ========================================

/**
 * Reset Password Form Schema
 * Used to validate new password input with same rules as registration
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Passwords must match
 */
export const createResetPasswordSchema = (t: TFunction) =>
  z.object({
    newPassword: createStrongPasswordSchema(t),
    confirmPassword: z
      .string()
      .min(1, t('validation:errors.password.required')),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t('validation:errors.password.mismatch'),
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;