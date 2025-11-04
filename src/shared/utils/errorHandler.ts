/**
 * Error Handler Utility
 *
 * Location: src/shared/utils/errorHandler.ts
 *
 * Handles parsing and formatting of API errors, especially ASP.NET Core validation errors
 */

import type { ValidationErrorResponse } from "../../data/remote/api/client";

/**
 * Parsed validation error with field-level details
 */
export interface FieldValidationError {
  field: string; // The field name (e.g., "username", "province.country")
  messages: string[]; // Array of error messages for this field
}

/**
 * Enhanced error object with validation details
 */
export interface ApiError {
  status: number;
  title: string;
  message: string; // General error message
  fieldErrors: FieldValidationError[]; // Field-specific validation errors
  isValidationError: boolean;
  traceId?: string;
}

/**
 * Check if error response is ASP.NET Core validation error format
 */
export function isValidationErrorResponse(error: any): error is ValidationErrorResponse {
  return (
    error &&
    typeof error === "object" &&
    "errors" in error &&
    typeof error.errors === "object" &&
    "status" in error &&
    error.status === 400
  );
}

/**
 * Parse ASP.NET Core validation errors into a more usable format
 *
 * Handles nested field names like:
 * - "Username" -> { field: "username", messages: [...] }
 * - "Province.Country" -> { field: "country", messages: [...] }
 * - "Municipality.Province" -> { field: "province", messages: [...] }
 */
export function parseValidationErrors(
  validationError: ValidationErrorResponse
): FieldValidationError[] {
  const fieldErrors: FieldValidationError[] = [];

  for (const [fieldPath, messages] of Object.entries(validationError.errors)) {
    // Extract the last part of nested field names (e.g., "Province.Country" -> "Country")
    const fieldName = fieldPath.includes(".")
      ? fieldPath.split(".").pop()!
      : fieldPath;

    // Convert to camelCase for consistency with frontend (e.g., "Username" -> "username")
    const normalizedField = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);

    fieldErrors.push({
      field: normalizedField,
      messages,
    });
  }

  return fieldErrors;
}

/**
 * Format field errors into a user-friendly message
 */
export function formatFieldErrorsMessage(fieldErrors: FieldValidationError[]): string {
  if (fieldErrors.length === 0) return "";

  // Create a bulleted list of all errors
  const errorMessages = fieldErrors.flatMap((fe) => fe.messages);

  if (errorMessages.length === 1) {
    return errorMessages[0];
  }

  return errorMessages.join("\n");
}

/**
 * Get a specific field's error messages
 */
export function getFieldErrors(
  fieldErrors: FieldValidationError[],
  fieldName: string
): string[] {
  const field = fieldErrors.find(
    (fe) => fe.field.toLowerCase() === fieldName.toLowerCase()
  );
  return field ? field.messages : [];
}

/**
 * Check if a specific field has errors
 */
export function hasFieldError(
  fieldErrors: FieldValidationError[],
  fieldName: string
): boolean {
  return getFieldErrors(fieldErrors, fieldName).length > 0;
}

/**
 * Parse any API error into a standardized ApiError format
 */
export function parseApiError(error: any): ApiError {
  // Handle ASP.NET Core validation errors
  if (isValidationErrorResponse(error)) {
    const fieldErrors = parseValidationErrors(error);
    return {
      status: error.status,
      title: error.title,
      message: formatFieldErrorsMessage(fieldErrors) || error.title,
      fieldErrors,
      isValidationError: true,
      traceId: error.traceId,
    };
  }

  // Handle custom error response format
  if (error && typeof error === "object" && "ErrorMessage" in error) {
    return {
      status: error.StatusCode || 500,
      title: error.ErrorType || "Error",
      message: error.ErrorMessage || "An error occurred",
      fieldErrors: [],
      isValidationError: false,
    };
  }

  // Handle generic errors
  return {
    status: 500,
    title: "Error",
    message: error?.message || "An unexpected error occurred",
    fieldErrors: [],
    isValidationError: false,
  };
}

/**
 * Set errors on react-hook-form
 *
 * @param setError - react-hook-form's setError function
 * @param fieldErrors - Array of field validation errors
 */
export function setFormFieldErrors(
  setError: (name: string, error: { type: string; message: string }) => void,
  fieldErrors: FieldValidationError[]
): void {
  fieldErrors.forEach((fieldError) => {
    setError(fieldError.field, {
      type: "manual",
      message: fieldError.messages.join(". "),
    });
  });
}
