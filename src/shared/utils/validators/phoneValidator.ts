import { z } from "zod";
import { t, type TFunction } from 'i18next';


/**
 * Validates if a phone number is in valid format
 * Accepts international format with country code
 *
 * @param phone - Phone number string (e.g., "+18091234567")
 * @returns boolean - true if valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Must start with + and have between 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/;

  return phoneRegex.test(cleaned);
};

/**
 * Formats phone number to E.164 format
 * Removes all formatting characters except + and digits
 *
 * @param phone - Phone number string
 * @returns string - Formatted phone (e.g., "+18091234567")
 */
export const formatPhoneToE164 = (phone: string): string => {
  return phone.replace(/[^\d+]/g, "");
};

/**
 * Extracts country code from phone number
 *
 * @param phone - Phone number string (e.g., "+1 809 123 4567")
 * @returns string - Country code (e.g., "+1")
 */
export const getCountryCode = (phone: string): string => {
  const match = phone.match(/^\+\d{1,3}/);
  return match ? match[0] : "";
};

/**
 * Extracts phone number without country code
 *
 * @param phone - Phone number string (e.g., "+1 809 123 4567")
 * @returns string - Phone without country code (e.g., "8091234567")
 */
export const getPhoneWithoutCountryCode = (phone: string): string => {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.replace(/^\+\d{1,3}/, "");
};

// ========================================
// ZOD VALIDATION SCHEMAS
// ========================================

/**
 * Basic phone validation (required)
 * Validates international phone format with country code
 */
export const phoneValidation = (t: TFunction) => z
  .string()
  .min(1, t('validation:errors.phone.required'))
  .refine(
    (phone) => {
      // Allow empty string if field is optional
      if (!phone) return true;

      // Validate format
      return isValidPhone(phone);
    },
    {
      message:
        t('validation:errors.phone.invalidFormat'),
    }
  );

/**
 * Optional phone validation
 * Same rules but allows empty string
 */
export const phoneValidationOptional = z
  .string()
  .optional()
  .refine(
    (phone) => {
      // Allow undefined or empty
      if (!phone || phone === "") return true;

      // Validate format if provided
      return isValidPhone(phone);
    },
    {
      message:
        t('validation:errors.phone.invalidFormat'),
    }
  );

/**
 * Dominican Republic specific phone validation
 * Validates phone numbers with +1 809, +1 829, +1 849 area codes
 */
export const dominicanaPhoneValidation = z
  .string()
  .min(1, t('validation:errors.phone.required'))
  .refine(
    (phone) => {
      if (!phone) return true;

      const cleaned = phone.replace(/[^\d+]/g, "");

      // Must start with +1 and have 809, 829, or 849 area code
      const drPhoneRegex = /^\+1(809|829|849)\d{7}$/;

      return drPhoneRegex.test(cleaned);
    },
    {
      message:
        t('validation:errors.phone.invalidFormat'),
    }
  );

// ========================================
// UTILITY EXPORTS
// ========================================

export default {
  isValidPhone,
  formatPhoneToE164,
  getCountryCode,
  getPhoneWithoutCountryCode,
  phoneValidation,
  phoneValidationOptional,
  dominicanaPhoneValidation,
};
