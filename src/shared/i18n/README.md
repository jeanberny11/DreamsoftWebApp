# Internationalization (i18n) Guide

This project uses `react-i18next` for managing translations, similar to Android's string resources.

## Quick Start

### Basic Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('auth'); // Specify namespace

  return (
    <div>
      <h1>{t('login.title')}</h1>
      <p>{t('login.subtitle')}</p>
    </div>
  );
}
```

### Multiple Namespaces

```tsx
function MyComponent() {
  const { t } = useTranslation(['auth', 'common']);

  return (
    <div>
      <h1>{t('auth:login.title')}</h1>
      <button>{t('common:actions.submit')}</button>
    </div>
  );
}
```

### Interpolation (Dynamic Values)

```tsx
function MyComponent() {
  const { t } = useTranslation('validation');

  const minLength = 8;
  return <p>{t('errors.password.minLength', { min: minLength })}</p>;
  // Output: "Password must be at least 8 characters"
}
```

## Changing Language

### Using the Language Switcher Component

```tsx
import { LanguageSwitcher } from '@/shared/components';

function Header() {
  return (
    <nav>
      <LanguageSwitcher />
    </nav>
  );
}
```

### Programmatically

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();

  const switchToSpanish = () => {
    i18n.changeLanguage('es');
  };

  const switchToEnglish = () => {
    i18n.changeLanguage('en');
  };

  return (
    <div>
      <button onClick={switchToEnglish}>English</button>
      <button onClick={switchToSpanish}>Español</button>
    </div>
  );
}
```

## Available Namespaces

- `common` - Common labels, actions, and messages
- `auth` - Authentication-related translations
- `validation` - Form validation error messages

## Folder Structure

```
src/shared/i18n/
├── config.ts              # i18n configuration
├── types.ts              # TypeScript types
├── index.ts              # Exports
└── locales/
    ├── en/               # English translations
    │   ├── common.json
    │   ├── auth.json
    │   └── validation.json
    └── es/               # Spanish translations
        ├── common.json
        ├── auth.json
        └── validation.json
```

## Adding New Translations

### 1. Add to English file

```json
// src/shared/i18n/locales/en/common.json
{
  "myNewKey": "My New Translation"
}
```

### 2. Add to Spanish file

```json
// src/shared/i18n/locales/es/common.json
{
  "myNewKey": "Mi Nueva Traducción"
}
```

### 3. Use in component

```tsx
const { t } = useTranslation('common');
return <p>{t('myNewKey')}</p>;
```

## Adding a New Language

### 1. Create translation files

```
src/shared/i18n/locales/fr/
├── common.json
├── auth.json
└── validation.json
```

### 2. Update config.ts

```typescript
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frValidation from './locales/fr/validation.json';

export const resources = {
  en: { ... },
  es: { ... },
  fr: {
    common: frCommon,
    auth: frAuth,
    validation: frValidation,
  },
} as const;
```

### 3. Update types.ts

```typescript
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
} as const;
```

## Using with Form Validation (Zod)

You can integrate i18n with your Zod schemas:

```typescript
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

function MyForm() {
  const { t } = useTranslation('validation');

  const schema = z.object({
    email: z.string()
      .min(1, t('errors.email.required'))
      .email(t('errors.email.invalid')),
    password: z.string()
      .min(8, t('errors.password.minLength', { min: 8 })),
  });

  // Use schema with react-hook-form or similar
}
```

## Best Practices

1. **Organize by feature** - Keep related translations together in namespaces
2. **Use nested keys** - Structure translations hierarchically (e.g., `auth.login.title`)
3. **Avoid hardcoded strings** - Always use `t()` for user-facing text
4. **Keep translations in sync** - Ensure all languages have the same keys
5. **Use interpolation** - For dynamic values like counts, names, etc.
6. **Default to common namespace** - For frequently used translations

## TypeScript Support

The project is configured with full TypeScript support for translations:

```tsx
// ✅ Type-safe - autocomplete works
const { t } = useTranslation('auth');
t('login.title'); // Autocomplete suggests available keys

// ✅ Type-safe namespaces
t('auth:login.title');

// ✅ Type-safe languages
const { i18n } = useTranslation();
i18n.changeLanguage('en'); // Only accepts 'en' | 'es'
```

## Current Language

Get the current language:

```tsx
const { i18n } = useTranslation();
console.log(i18n.language); // 'en' or 'es'
```

## Language Persistence

The selected language is automatically saved to localStorage and restored on page reload.
