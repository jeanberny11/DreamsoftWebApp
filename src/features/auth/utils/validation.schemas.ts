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

// Factory function to create password schema with translations
export const createPasswordSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('validation:errors.password.required'))
    .min(8, t('validation:errors.password.minLength', { min: 8 }))
    .max(100, t('validation:errors.password.maxLength', { max: 100 }));

// Factory function to create login schema with translations
export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: createEmailSchema(t),
    userName: z.string().min(1, t('validation:errors.username.required')),
    password: z.string().min(1, t('validation:errors.password.required')),
    rememberMe: z.boolean().optional(),
  });

// Export type (inferred from return type of factory function)
export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;