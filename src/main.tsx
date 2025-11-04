/**
 * Main Entry Point
 * Location: src/main.tsx
 *
 * IMPORTANT: CSS import order matters!
 * 1. PrimeReact base theme and core CSS
 * 2. PrimeIcons
 * 3. Our custom styles bundle (styles/index.css)
 * 4. Global styles (index.css)
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './shared/i18n/config'; // Initialize i18n

// ========================================
// 1. PRIMEREACT BASE THEME
// Must come first for proper theming
// ========================================
import 'primereact/resources/themes/lara-light-teal/theme.css';

// ========================================
// 2. PRIMEREACT CORE CSS
// ========================================
import 'primereact/resources/primereact.min.css';

// ========================================
// 3. PRIMEICONS
// ========================================
import 'primeicons/primeicons.css';

// ========================================
// 4. OUR CUSTOM STYLES BUNDLE
// This imports (in order):
// - variables.css
// - themes/light.css
// - themes/dark.css
// - primereact-theme.css
// ========================================
import './styles/index.css';

// ========================================
// 5. GLOBAL STYLES
// App-wide resets and utilities
// ========================================
import './index.css';

// ========================================
// RENDER APP
// ========================================
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);