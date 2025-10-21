/**
 * PrimeReact Theme Configuration
 *
 * This file configures PrimeReact components to use our Modern Teal color scheme.
 * PrimeReact has its own theming system that we customize here.
 */

export const primeReactTheme = {
  // Primary color (Teal)
  primary: '#14b8a6',
  primaryDark: '#0d9488',
  primaryLight: '#2dd4bf',

  // Secondary color (Emerald)
  secondary: '#10b981',
  secondaryDark: '#059669',
  secondaryLight: '#34d399',

  // Semantic colors
  success: '#22c55e',
  info: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  error: '#ef4444',

  // Surfaces
  surface: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    disabled: '#9ca3af',
  },
};

/**
 * PrimeReact CSS Variables Override
 *
 * These can be applied to customize PrimeReact's default theme.
 * Apply this in your main CSS or use PrimeReact's PrimeReactProvider.
 */
export const primeReactCSSVars = {
  '--primary-color': '#14b8a6',
  '--primary-color-text': '#ffffff',
  '--surface-0': '#ffffff',
  '--surface-50': '#f9fafb',
  '--surface-100': '#f3f4f6',
  '--surface-200': '#e5e7eb',
  '--surface-300': '#d1d5db',
  '--surface-400': '#9ca3af',
  '--surface-500': '#6b7280',
  '--surface-600': '#4b5563',
  '--surface-700': '#374151',
  '--surface-800': '#1f2937',
  '--surface-900': '#111827',
  '--text-color': '#111827',
  '--text-color-secondary': '#4b5563',
  '--blue-500': '#14b8a6', // Override blue with our teal
  '--green-500': '#22c55e',
  '--yellow-500': '#f59e0b',
  '--red-500': '#ef4444',
};

/**
 * Apply PrimeReact theme
 *
 * Call this function in your app initialization to apply the theme.
 */
export function applyPrimeReactTheme() {
  const root = document.documentElement;
  Object.entries(primeReactCSSVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export default primeReactTheme;
