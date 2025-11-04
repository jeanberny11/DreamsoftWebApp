/**
 * Registration Validation
 *
 * Location: src/features/auth/utils/register.validation.ts
 *
 * Zod validation schemas for multi-step registration form
 * TypeScript types are auto-generated from these schemas using z.infer
 */

import { z } from "zod";
import type { TFunction } from "i18next";

// ========================================
// AGE CALCULATION HELPER
// ========================================

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// ========================================
// PASSWORD VALIDATION FACTORY
// ========================================

const createPasswordSchema = (t: TFunction) =>
  z
    .string()
    .min(8, t("validation:errors.password.minLength", { min: 8 }))
    .regex(/[A-Z]/, t("validation:errors.password.uppercase"))
    .regex(/[a-z]/, t("validation:errors.password.lowercase"))
    .regex(/[0-9]/, t("validation:errors.password.number"))
    .regex(/[^A-Za-z0-9]/, t("validation:errors.password.special"));

// ========================================
// EMAIL VERIFICATION STEP SCHEMA FACTORY
// ========================================

export const createEmailVerificationStepSchema = (t: TFunction) =>
  z.object({
    email: z
      .email({ message: t("validation:errors.email.invalid") })
      .min(1, t("validation:errors.email.required")),
    verificationCode: z
      .string()
      .length(6, t("validation:errors.verification.invalid"))
      .regex(/^\d{6}$/, t("validation:errors.verification.invalid")),
    emailVerified: z.boolean().refine((val) => val === true, {
      message: t("validation:errors.verification.required"),
    }),
  });

// ========================================
// ACCOUNT ESSENTIALS STEP SCHEMA FACTORY
// ========================================

export const createAccountEssentialsStepSchema = (t: TFunction) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t("validation:errors.name.required"))
        .min(2, t("validation:errors.name.minLength", { min: 2 }))
        .max(50, t("validation:errors.name.maxLength", { max: 50 }))
        .regex(/^[a-zA-Z\s]+$/, t("validation:errors.name.invalid")),
      lastName: z
        .string()
        .min(1, t("validation:errors.name.required"))
        .min(2, t("validation:errors.name.minLength", { min: 2 }))
        .max(50, t("validation:errors.name.maxLength", { max: 50 }))
        .regex(/^[a-zA-Z\s]+$/, t("validation:errors.name.invalid")),
      username: z
        .string()
        .min(1, t("validation:errors.username.required"))
        .min(3, t("validation:errors.username.minLength", { min: 3 }))
        .max(30, t("validation:errors.username.maxLength", { max: 30 })),
      password: createPasswordSchema(t),
      confirmPassword: z
        .string()
        .min(1, t("validation:errors.password.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation:errors.password.mismatch"),
      path: ["confirmPassword"],
    });

// ========================================
// PERSONAL INFO STEP SCHEMA FACTORY
// ========================================

export const createPersonalInfoStepSchema = (t: TFunction) =>
  z.object({
    phone: z
      .string()
      .min(1, t("validation:errors.phone.required"))
      .regex(
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
        t("validation:errors.phone.invalid")
      ),
    dob: z
      .date({
        message: t("validation:errors.date.required"),
      })
      .refine(
        (date) => {
          const age = calculateAge(date);
          return age >= 18;
        },
        {
          message: t("validation:errors.date.minAge", { age: 18 }),
        }
      )
      .refine(
        (date) => {
          const age = calculateAge(date);
          return age <= 120;
        },
        {
          message: t("validation:errors.date.invalid"),
        }
      ),
    gender: z
      .object({
        genderId: z.number(),
        name: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: t("validation:errors.required"),
      }),
    idType: z
      .object({
        idTypeId: z.number(),
        name: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: t("validation:errors.required"),
      }),
    idNumber: z
      .string()
      .min(1, t("validation:errors.required"))
      .min(5, t("validation:errors.name.minLength", { min: 5 }))
      .max(30, t("validation:errors.name.maxLength", { max: 30 })),
  });

// ========================================
// ADDRESS INFO STEP SCHEMA FACTORY
// ========================================

export const createAddressInfoStepSchema = (t: TFunction) =>
  z.object({
    address: z
      .string()
      .min(1, t("validation:errors.address.required"))
      .min(10, t("validation:errors.name.minLength", { min: 10 }))
      .max(200, t("validation:errors.name.maxLength", { max: 200 })),
    country: z
      .object({
        countryId: z.number(),
        name: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: t("validation:errors.address.country"),
      }),
    province: z
      .object({
        provinceId: z.number(),
        name: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: t("validation:errors.address.state"),
      }),
    municipality: z
      .object({
        municipalityId: z.number(),
        name: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: t("validation:errors.required"),
      }),
  });

// ========================================
// AUTO-GENERATED TYPESCRIPT TYPES
// ========================================

export type EmailVerificationStepData = z.infer<
  ReturnType<typeof createEmailVerificationStepSchema>
>;
export type AccountEssentialsStepData = z.infer<
  ReturnType<typeof createAccountEssentialsStepSchema>
>;
export type PersonalInfoStepData = z.infer<
  ReturnType<typeof createPersonalInfoStepSchema>
>;
export type AddressInfoStepData = z.infer<
  ReturnType<typeof createAddressInfoStepSchema>
>;

// ========================================
// PASSWORD STRENGTH HELPER
// ========================================

export const getPasswordStrength = (
  password: string,
  t: TFunction
): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      score: 25,
      label: t("validation:passwordStrength.weak"),
      color: "danger",
    };
  } else if (score <= 4) {
    return {
      score: 50,
      label: t("validation:passwordStrength.fair"),
      color: "warning",
    };
  } else if (score <= 5) {
    return {
      score: 75,
      label: t("validation:passwordStrength.good"),
      color: "info",
    };
  } else {
    return {
      score: 100,
      label: t("validation:passwordStrength.strong"),
      color: "success",
    };
  }
};
