# Error Handler Utility

This utility provides comprehensive error handling for ASP.NET Core validation errors.

## Usage Example

### In a Component with react-hook-form

```typescript
import { useForm } from "react-hook-form";
import { parseApiError, setFormFieldErrors } from "@/shared/utils/errorHandler";
import accountService from "@/features/auth/services/account.service";

function MyForm() {
  const { control, setError, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await accountService.createAccount(data);
      // Success!
    } catch (error) {
      const apiError = parseApiError(error);

      if (apiError.isValidationError) {
        // Set errors on individual form fields
        setFormFieldErrors(setError, apiError.fieldErrors);

        // Also show a toast notification
        toast.show({
          severity: "error",
          summary: "Validation Error",
          detail: formatFieldErrorsMessage(apiError.fieldErrors),
        });
      } else {
        // Handle generic errors
        toast.show({
          severity: "error",
          summary: "Error",
          detail: apiError.message,
        });
      }
    }
  };
}
```

## Backend Error Format

The utility handles ASP.NET Core validation errors in this format:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Username": ["Username can only contain letters and numbers."],
    "Province.Country": ["The Country field is required."],
    "Municipality.Province": ["The Province field is required."]
  },
  "traceId": "00-1e63dd26d8496a83461f59a921c59473-4ec136dc52b71f6d-00"
}
```

## Field Name Mapping

The utility automatically handles nested field names from ASP.NET Core:

- `"Username"` → `"username"`
- `"Province.Country"` → `"country"`
- `"Municipality.Province"` → `"province"`

This matches your frontend field names in camelCase.

## Available Functions

### `parseApiError(error: any): ApiError`
Parses any API error into a standardized format.

### `formatFieldErrorsMessage(fieldErrors: FieldValidationError[]): string`
Formats field errors into a user-friendly message.

### `getFieldErrors(fieldErrors: FieldValidationError[], fieldName: string): string[]`
Gets error messages for a specific field.

### `hasFieldError(fieldErrors: FieldValidationError[], fieldName: string): boolean`
Checks if a field has errors.

### `setFormFieldErrors(setError, fieldErrors)`
Sets errors on react-hook-form fields (useful for inline validation display).
