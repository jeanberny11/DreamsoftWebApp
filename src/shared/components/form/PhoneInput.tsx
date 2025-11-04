import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

// ========================================
// TYPES
// ========================================

interface PhoneInputProps<T extends FieldValues> {
  /** Field name for React Hook Form */
  name: Path<T>;

  /** Input label */
  label?: string;

  /** React Hook Form control */
  control: Control<T>;

  /** Error message from validation */
  error?: string;

  /** Initial country code (e.g., 'us', 'do', 'ca') */
  defaultCountry?: string;

  /** Input placeholder */
  placeholder?: string;

  /** Disable input */
  disabled?: boolean;

  /** Additional CSS classes for the container */
  className?: string;

  /** Make the field required (adds asterisk to label) */
  required?: boolean;
}

// ========================================
// COMPONENT
// ========================================

export const PhoneInput = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  defaultCountry = "do",
  placeholder = "Enter phone number",
  disabled = false,
  className = "",
  required = false,
}: PhoneInputProps<T>) => {
  return (
    <div className={`phone-input-wrapper ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Phone Input with Controller */}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <IntlPhoneInput
            defaultCountry={defaultCountry}
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            inputClassName={`w-full ${error ? "phone-input-invalid" : ""}`}
            className={error ? "phone-input-error" : ""}
          />
        )}
      />

      {/* Error Message */}
      {error && (
        <small className="text-red-500 mt-1 block text-xs">{error}</small>
      )}

      {/* Custom Styles */}
      <style>{`
        /* ========================================
           PHONE INPUT CUSTOM STYLES
           Matching DreamSoft App Theme
           Using CSS variables from variables.css
           ======================================== */

        .phone-input-wrapper .react-international-phone-input-container {
          width: 100%;
        }

        .phone-input-wrapper .react-international-phone-input {
          border: 1px solid var(--color-border-medium);
          border-radius: 6px;
          transition: all 0.2s;
          font-family: inherit;
          background: var(--input-bg);
        }

        .phone-input-wrapper .react-international-phone-input:hover {
          border-color: var(--color-border-dark);
        }

        .phone-input-wrapper .react-international-phone-input:focus-within {
          outline: 0;
          outline-offset: 0;
          box-shadow: 0 0 0 0.2rem rgba(20, 184, 166, 0.2);
          border-color: var(--color-primary-500);
        }

        /* Country selector button */
        .phone-input-wrapper .react-international-phone-country-selector-button {
          border: none;
          border-right: 1px solid var(--color-border-light);
          padding: 0 12px;
          background: var(--color-bg-secondary);
          transition: background-color 0.2s;
          color: var(--color-text-primary);
        }

        .phone-input-wrapper .react-international-phone-country-selector-button:hover {
          background: var(--color-bg-hover);
        }

        /* Phone input field */
        .phone-input-wrapper .react-international-phone-input-container input {
          border: none;
          outline: none;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          width: 100%;
          color: var(--input-text);
          background: transparent;
        }

        .phone-input-wrapper .react-international-phone-input-container input::placeholder {
          color: var(--input-placeholder);
        }

        .phone-input-wrapper .react-international-phone-input-container input:focus {
          outline: none;
        }

        /* Dropdown menu */
        .react-international-phone-country-selector-dropdown {
          border: 1px solid var(--color-border-medium);
          border-radius: 6px;
          box-shadow: var(--card-shadow);
          max-height: 300px;
          overflow-y: auto;
          background: var(--card-bg);
        }

        /* Dropdown items */
        .react-international-phone-country-selector-dropdown__list-item {
          padding: 0.5rem 1rem;
          transition: background-color 0.2s;
          color: var(--color-text-primary);
        }

        .react-international-phone-country-selector-dropdown__list-item:hover {
          background-color: var(--color-bg-hover);
        }

        .react-international-phone-country-selector-dropdown__list-item--selected {
          background-color: var(--color-primary-500);
          color: #ffffff;
        }

        .react-international-phone-country-selector-dropdown__list-item--focused {
          background-color: var(--color-primary-50);
          color: var(--color-primary-900);
        }

        /* Invalid/Error state */
        .phone-input-wrapper .phone-input-error .react-international-phone-input {
          border-color: var(--color-error-500) !important;
        }

        .phone-input-wrapper .phone-input-error .react-international-phone-input:focus-within {
          box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2);
          border-color: var(--color-error-500) !important;
        }

        /* Disabled state */
        .phone-input-wrapper .react-international-phone-input-container input:disabled {
          background-color: var(--color-bg-disabled);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .phone-input-wrapper .react-international-phone-country-selector-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          background-color: var(--color-bg-disabled);
        }

        /* Scrollbar styling for dropdown */
        .react-international-phone-country-selector-dropdown::-webkit-scrollbar {
          width: 8px;
        }

        .react-international-phone-country-selector-dropdown::-webkit-scrollbar-track {
          background: var(--color-bg-secondary);
        }

        .react-international-phone-country-selector-dropdown::-webkit-scrollbar-thumb {
          background: var(--color-gray-400);
          border-radius: 4px;
        }

        .react-international-phone-country-selector-dropdown::-webkit-scrollbar-thumb:hover {
          background: var(--color-gray-500);
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;
