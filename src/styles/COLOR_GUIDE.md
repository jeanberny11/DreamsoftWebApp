# Color Scheme Guide - DreamSoft WebApp

## Modern Teal Color Scheme

This guide explains how to use the color system in your components.

---

## 🎨 Color Palette

### Primary Color (Teal)
Main brand color - Use for primary actions, links, and highlights
- **Teal 500** (#14b8a6) - Default primary
- Shades: 50, 100, 200, 300, 400, **500**, 600, 700, 800, 900, 950

### Secondary Color (Emerald)
Supporting color - Use for secondary actions and accents
- **Emerald 500** (#10b981) - Default secondary
- Shades: 50, 100, 200, 300, 400, **500**, 600, 700, 800, 900, 950

### Accent Color (Cyan)
Highlight color - Use for special features and highlights
- **Cyan 500** (#06b6d4) - Default accent
- Shades: 50, 100, 200, 300, 400, **500**, 600, 700, 800, 900, 950

### Semantic Colors

#### Success (Green)
- Use for: Success messages, completed states, positive actions
- Default: **Green 500** (#22c55e)

#### Warning (Amber)
- Use for: Warnings, caution messages, pending states
- Default: **Amber 500** (#f59e0b)

#### Error (Red)
- Use for: Error messages, destructive actions, critical alerts
- Default: **Red 500** (#ef4444)

#### Info (Blue)
- Use for: Information messages, tips, neutral notifications
- Default: **Blue 500** (#3b82f6)

### Neutral Colors (Gray)
Use for: Text, borders, backgrounds, and disabled states
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

---

## 💻 How to Use Colors

### 1. Using Tailwind CSS Classes

```tsx
// Primary colors
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Button
</button>

// Secondary colors
<button className="bg-secondary-500 hover:bg-secondary-600 text-white">
  Secondary Button
</button>

// Semantic colors
<div className="bg-success-100 text-success-800 border border-success-500">
  Success alert
</div>

<div className="bg-error-100 text-error-800 border border-error-500">
  Error alert
</div>

// Text colors
<h1 className="text-gray-900">Main heading</h1>
<p className="text-gray-600">Secondary text</p>
<span className="text-gray-400">Disabled text</span>
```

### 2. Using CSS Variables

```tsx
// In your CSS files or styled components
.my-component {
  background-color: var(--color-primary-500);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-medium);
}

.my-button {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.my-button:hover {
  background-color: var(--btn-primary-bg-hover);
}
```

### 3. Using in Inline Styles

```tsx
<div style={{ backgroundColor: 'var(--color-primary-500)' }}>
  Content
</div>
```

### 4. PrimeReact Components

PrimeReact components automatically use the theme we configured:

```tsx
import { Button } from 'primereact/button';

// These will use our teal color scheme
<Button label="Primary" className="p-button-primary" />
<Button label="Success" className="p-button-success" />
<Button label="Warning" className="p-button-warning" />
<Button label="Danger" className="p-button-danger" />
```

---

## 📋 Color Usage Guidelines

### Primary Color (Teal)
✅ **Use for:**
- Primary action buttons
- Active navigation items
- Links
- Selected states
- Important highlights
- Progress indicators

❌ **Don't use for:**
- Large background areas (use lighter shades)
- Body text (use gray instead)

### Secondary Color (Emerald)
✅ **Use for:**
- Secondary action buttons
- Alternative highlights
- Success indicators (overlaps with success color)
- Growth/positive metrics

### Accent Color (Cyan)
✅ **Use for:**
- Special features
- Badges and tags
- Information callouts
- Interactive elements that need attention

### Semantic Colors

#### Success (Green)
- ✅ Completed tasks
- ✅ Successful operations
- ✅ Positive status
- ✅ "Add" or "Create" actions

#### Warning (Amber)
- ⚠️ Warnings before actions
- ⚠️ Low stock alerts
- ⚠️ Pending approvals
- ⚠️ Important notices

#### Error (Red)
- ❌ Error messages
- ❌ Failed operations
- ❌ Delete/destructive actions
- ❌ Critical alerts

#### Info (Blue)
- ℹ️ General information
- ℹ️ Help tooltips
- ℹ️ Neutral notifications
- ℹ️ Educational content

### Text Colors

```tsx
// Primary text - Main content, headings
<h1 className="text-gray-900">Title</h1>

// Secondary text - Supporting content, labels
<p className="text-gray-600">Description</p>

// Tertiary text - Less important information
<span className="text-gray-500">Metadata</span>

// Disabled text - Inactive elements
<span className="text-gray-400">Disabled</span>
```

---

## 🌗 Dark Mode Support

The color scheme automatically adapts to dark mode when you set the data-theme attribute:

```tsx
// Set dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Set light mode
document.documentElement.setAttribute('data-theme', 'light');
```

All CSS variables automatically adjust for the selected theme.

---

## 🎯 Common Patterns

### Button Patterns

```tsx
// Primary action
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
  Save Changes
</button>

// Secondary action
<button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
  Cancel
</button>

// Danger action
<button className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded">
  Delete
</button>
```

### Card Patterns

```tsx
// Basic card
<div className="bg-white border border-gray-200 rounded-lg shadow-card p-6">
  Card content
</div>

// Highlighted card
<div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
  Featured content
</div>
```

### Input Patterns

```tsx
// Normal input
<input
  className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded px-3 py-2"
  type="text"
/>

// Error state
<input
  className="border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-200 rounded px-3 py-2"
  type="text"
/>
```

### Status Badge Patterns

```tsx
// Success
<span className="bg-success-100 text-success-800 px-2 py-1 rounded text-sm">
  Active
</span>

// Warning
<span className="bg-warning-100 text-warning-800 px-2 py-1 rounded text-sm">
  Pending
</span>

// Error
<span className="bg-error-100 text-error-800 px-2 py-1 rounded text-sm">
  Inactive
</span>
```

---

## 🔍 Accessibility

Our color scheme follows WCAG 2.1 AA standards:

- **Text contrast:** All text colors meet minimum contrast ratios
- **Interactive elements:** Clear visual feedback on hover/focus
- **Color blindness:** Semantic meaning doesn't rely solely on color

### Contrast Guidelines

- Primary text on white: ✅ AAA (Ratio > 7:1)
- Secondary text on white: ✅ AA (Ratio > 4.5:1)
- Primary buttons: ✅ AA (White text on teal background)

---

## 🛠️ Customization

To modify colors, edit these files:

1. **CSS Variables:** `src/styles/variables.css`
2. **Tailwind Config:** `tailwind.config.js`
3. **PrimeReact Theme:** `src/shared/config/theme.config.ts`
4. **Light Theme:** `src/styles/themes/light.css`
5. **Dark Theme:** `src/styles/themes/dark.css`

---

**Remember:** Consistency is key! Use the same colors for the same purposes throughout your app.
