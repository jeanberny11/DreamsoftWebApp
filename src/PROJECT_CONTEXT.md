# DreamSoft WebApp - Project Context Document

## 📋 Project Overview

**Project Name:** DreamsoftWebApp  
**Type:** Sales and Bills Management Application  
**Tech Stack:** React 19 + TypeScript + Vite + TailwindCSS + PrimeReact

---

## 🎯 Project Goals

Building a modern, scalable web application for managing:
- Sales transactions
- Inventory
- Customer management
- Billing/Invoicing
- Business reports

---

## 🏗️ Architecture Decisions

### Chosen Structure: Feature-Based Architecture

**Why this structure?**
1. **Scalability** - Easy to add new features without affecting existing ones
2. **Maintainability** - Clear separation of concerns
3. **Team Collaboration** - Features can be developed independently
4. **Testability** - Each module can be tested in isolation
5. **Industry Best Practices** - Follows Feature-Sliced Design (FSD) and Clean Architecture principles

### Folder Structure

**Complete structure created on 2025-10-12** following Feature-Sliced Design (FSD) and enterprise best practices researched from official documentation.

```
src/
├── app/                   # Application initialization layer
│   ├── api/              # API client configuration
│   ├── providers/        # App-wide providers (React Query, Theme, Auth)
│   ├── router/           # React Router setup and route definitions
│   └── store/            # Global app state (Zustand stores)
│
├── features/             # Feature-based modules (business domains)
│   ├── auth/            # Authentication & authorization
│   │   ├── components/  # Auth-specific UI components
│   │   ├── hooks/       # Auth custom hooks (useAuth, useLogin, etc.)
│   │   ├── services/    # Auth API calls (login, register, logout)
│   │   ├── stores/      # Auth state management (Zustand)
│   │   ├── types/       # Auth TypeScript types
│   │   └── utils/       # Auth utilities & validation schemas
│   │
│   ├── dashboard/       # Dashboard feature
│   │   ├── components/  # Dashboard components (stats, charts, etc.)
│   │   ├── hooks/       # Dashboard custom hooks
│   │   ├── services/    # Dashboard API calls
│   │   └── types/       # Dashboard TypeScript types
│   │
│   ├── sales/           # Sales management feature
│   │   ├── components/  # Sales components (list, form, invoice, etc.)
│   │   ├── hooks/       # Sales custom hooks
│   │   ├── services/    # Sales API calls
│   │   ├── stores/      # Sales state management
│   │   ├── types/       # Sales TypeScript types
│   │   └── utils/       # Sales utilities (calculations, validation)
│   │
│   ├── inventory/       # Inventory management feature
│   │   ├── components/  # Inventory components (products, stock, etc.)
│   │   ├── hooks/       # Inventory custom hooks
│   │   ├── services/    # Inventory API calls
│   │   ├── stores/      # Inventory state management
│   │   ├── types/       # Inventory TypeScript types
│   │   └── utils/       # Inventory utilities
│   │
│   ├── customers/       # Customer management feature
│   │   ├── components/  # Customer components (list, form, details)
│   │   ├── hooks/       # Customer custom hooks
│   │   ├── services/    # Customer API calls
│   │   ├── stores/      # Customer state management
│   │   ├── types/       # Customer TypeScript types
│   │   └── utils/       # Customer utilities
│   │
│   └── reports/         # Reports & analytics feature
│       ├── components/  # Report components (charts, exports)
│       ├── hooks/       # Report custom hooks
│       ├── services/    # Report API calls
│       ├── types/       # Report TypeScript types
│       └── utils/       # Report utilities (chart helpers, export)
│
├── shared/              # Shared/reusable code across features
│   ├── components/      # Shared UI components
│   │   ├── ui/         # Atomic UI components (Button, Card, Input, Modal, etc.)
│   │   ├── layout/     # Layout components (Navbar, Sidebar, Footer, Breadcrumb)
│   │   ├── form/       # Form components (FormField, FormError, FormLabel)
│   │   └── feedback/   # Feedback components (Toast, ErrorBoundary, LoadingScreen)
│   │
│   ├── hooks/          # Shared custom hooks (useDebounce, useLocalStorage, etc.)
│   │
│   ├── utils/          # Utility functions
│   │   ├── formatters/ # Formatters (date, currency, number)
│   │   ├── validators/ # Validators (email, phone, etc.)
│   │   └── helpers/    # Helper functions (array, object, string utils)
│   │
│   ├── constants/      # App-wide constants (API routes, config)
│   ├── types/          # Shared TypeScript types
│   └── config/         # Configuration files (theme, app config)
│
├── assets/             # Static assets
│   ├── images/         # Images (logos, placeholders)
│   ├── icons/          # Custom icons
│   └── fonts/          # Custom fonts
│
├── styles/             # Global styles
│   └── themes/         # Theme files (light, dark)
│
├── types/              # Global TypeScript definitions
│
├── App.tsx             # Root component
├── App.css             # App styles
├── main.tsx            # Entry point
├── index.css           # Global styles
└── PROJECT_CONTEXT.md  # This file
```

**Architecture Notes:**
- Maximum 3 levels of nesting (following React docs recommendation)
- Each feature is self-contained and can be developed independently
- Shared layer contains only truly reusable code
- `app/` layer handles application initialization and global concerns

---

## 📦 Tech Stack Details

### Dependencies (from package.json)

**Core:**
- `react: ^19.1.1` & `react-dom: ^19.1.1`
- `typescript: ~5.9.3`
- `vite: ^7.1.7`

**UI Framework:**
- `primereact: ^10.9.7` - Component library
- `primeicons: ^7.0.0` - Icon set
- `tailwindcss: ^4.1.14` - Utility-first CSS
- `@tailwindcss/vite: ^4.1.14` - Vite plugin

**Routing:**
- `react-router-dom: ^7.9.4`

**Forms & Validation:**
- `react-hook-form: ^7.65.0` - Form management
- `@hookform/resolvers: ^5.2.2` - Form validation resolvers
- `zod: ^4.1.12` - Schema validation

**Data Fetching & State:**
- `@tanstack/react-query: ^5.90.2` - Server state management
- `@tanstack/react-query-devtools: ^5.90.2` - Dev tools
- `zustand: ^5.0.8` - Client state management
- `axios: ^1.12.2` - HTTP client

---

## 🔧 What We've Built So Far

### Phase 1: Project Foundation (Completed 2025-10-12)

#### 1. **Complete Folder Structure** ✅

Successfully created a production-ready folder structure with **60+ folders** following:
- **Feature-Sliced Design (FSD)** methodology
- **Enterprise best practices** from 2025 industry standards
- **React official recommendations** (max 3-level nesting)

**Structure highlights:**
- `app/` layer: Application initialization (API, providers, router, stores)
- `features/` layer: 6 business features (auth, dashboard, sales, inventory, customers, reports)
- `shared/` layer: Reusable components, hooks, utilities
- `assets/`, `styles/`, `types/` for supporting resources

Each feature includes dedicated folders for:
- `components/` - Feature-specific UI
- `hooks/` - Custom React hooks
- `services/` - API calls
- `stores/` - State management (Zustand)
- `types/` - TypeScript definitions
- `utils/` - Validation and helpers

---

### Phase 0: Initial Setup (Previous work - NOT YET IMPLEMENTED)

> **Note:** The sections below describe planned architecture that hasn't been implemented yet. They are kept for reference.

#### Planned: Core API Client (`src/app/api/client.ts`)

**Purpose:** Centralized HTTP client for all API calls

**Planned Features:**
- Base URL configuration from environment variables
- 15-second timeout
- Request interceptor: Automatically adds JWT token to headers
- Response interceptor: Global error handling
  - 401: Auto logout and redirect to login
  - 403: Forbidden access
  - 404: Not found
  - 500: Server error

---

#### Planned: React Query Provider (`src/app/providers/QueryProvider.tsx`)

**Purpose:** Manages server state (data fetching, caching, synchronization)

**Planned Configuration:**
- Retry failed requests once
- Don't refetch on window focus
- 5-minute stale time (data considered fresh for 5 min)
- Includes React Query DevTools for debugging

---

#### Planned: Router Configuration (`src/app/router/index.tsx`)

**Purpose:** Defines all application routes

**Planned Route Structure:**
```
/ → Redirect to /dashboard
/auth/login → Login page (AuthLayout)
/dashboard → Dashboard (MainLayout)
/sales → Sales list (MainLayout)
/inventory → Inventory (MainLayout)
/customers → Customers (MainLayout)
/reports → Reports (MainLayout)
```

---

#### Current: Simple App.tsx

**Current State:** Basic demo component testing PrimeReact and TailwindCSS integration

**Next:** Will be refactored to include providers and routing once we build the app layer

---

## 🎓 Development Workflow

### Working Method Established:

1. **Explain the concept** - What and why
2. **Break down steps** - Show the approach
3. **Wait for confirmation** - Review and ask questions
4. **Implement step-by-step** - Code together
5. **Explain the code** - Understanding over speed
6. **Verify understanding** - Before moving to next step

---

## 📝 Next Steps

### Immediate Priorities (Phase 2):

1. ✅ ~~Create folder structure~~ - **COMPLETED**
2. **App Layer Setup** (Next):
   - Create API client (`src/app/api/client.ts`)
   - Set up React Query Provider (`src/app/providers/QueryProvider.tsx`)
   - Configure Router (`src/app/router/index.tsx`)
   - Create route protection (ProtectedRoute, PublicRoute)
3. **Environment variables** - Set up `.env` file
4. **Shared Layout Components**:
   - MainLayout with Navbar and Sidebar
   - AuthLayout for login/register
5. **Shared UI Components** - Reusable buttons, cards, inputs, etc.
6. **Auth Feature** (First complete feature):
   - Login page with form validation
   - Auth service (API calls)
   - Auth store (Zustand)
   - Token management
7. **Dashboard Feature** - First authenticated page

### Future Features (Phase 3+):

- Sales module (invoices, transactions)
- Inventory module (products, stock)
- Customer module (CRM features)
- Reports module (analytics, charts)
- Settings page
- User profile management

---

## 🚀 How to Continue Development

### For Claude Code (or any AI assistant):

When working on this project:

1. **Follow the established structure** - Keep features isolated
2. **Use step-by-step approach** - Explain before implementing
3. **Maintain consistency** - Follow existing patterns:
   - Axios for API calls
   - React Query for data fetching
   - Zustand for state
   - React Hook Form + Zod for forms
   - PrimeReact for UI components
   - TailwindCSS for styling

4. **Code style:**
   - TypeScript strict mode
   - Functional components with hooks
   - Arrow functions
   - Named exports for components
   - Clear variable names

5. **Always explain:**
   - Why we're doing something
   - How it fits into the architecture
   - What problem it solves

---

## 💡 Key Design Principles

1. **Separation of Concerns** - Each file has one responsibility
2. **DRY (Don't Repeat Yourself)** - Reuse through shared components
3. **Single Source of Truth** - Centralized configuration
4. **Progressive Enhancement** - Build features incrementally
5. **Type Safety** - Leverage TypeScript fully
6. **Performance** - Lazy loading, memoization where needed
7. **Developer Experience** - Clear structure, good naming

---

## 🔗 Important Files to Remember

### Configuration Files:
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - TailwindCSS configuration (if needed)
- `.env` - Environment variables (to be created)

### App Layer Files (To be created):
- `src/app/api/client.ts` - API client
- `src/app/router/index.tsx` - Routes
- `src/app/providers/QueryProvider.tsx` - React Query setup
- `src/app/store/` - Global Zustand stores

### Entry Points:
- `src/main.tsx` - App entry point
- `src/App.tsx` - Root component
- `index.html` - HTML template

---

## 📞 Communication Guidelines

When asking Claude for help:

✅ **Good examples:**
- "Can you explain how React Query caching works in our setup?"
- "Let's create the Dashboard page step-by-step"
- "Why did we choose Zustand over Redux?"

✅ **Include context:**
- Mention which feature you're working on
- Reference existing files if related
- Ask for explanations when unclear

---

## 🎯 Project Status

### Phase 1: Foundation ✅ COMPLETED (2025-10-12)

**Completed:**
- ✅ Project initialized with React 19 + TypeScript + Vite
- ✅ Dependencies installed (PrimeReact, TailwindCSS, React Query, Zustand, etc.)
- ✅ Complete folder structure created (60+ folders)
- ✅ Architecture researched and documented (FSD + Enterprise best practices)

### Phase 2: Core Implementation 🔄 READY TO START

**Next Tasks:**
- ⏳ App layer setup (API client, providers, router)
- ⏳ Environment variables configuration
- ⏳ Shared layout components
- ⏳ Shared UI components
- ⏳ Auth feature (complete implementation)
- ⏳ Dashboard feature

### Phase 3: Feature Development 📋 PLANNED

**Pending:**
- ⏳ Sales module (invoices, transactions)
- ⏳ Inventory module (products, stock)
- ⏳ Customer module (CRM features)
- ⏳ Reports module (analytics, charts)
- ⏳ Settings and profile management

---

## 🤝 Developer Notes

**Original Developer Preferences:**
- Wants to learn while building
- Prefers step-by-step explanations
- Values understanding over speed
- Asks clarifying questions
- Reviews before proceeding

**Code Quality:**
- Clean, readable code
- Proper TypeScript types
- Consistent naming conventions
- Comments for complex logic only
- Self-documenting code preferred

---

## 📚 Resources

- PrimeReact Docs: https://primereact.org/
- TailwindCSS Docs: https://tailwindcss.com/
- React Query Docs: https://tanstack.com/query/latest
- Zustand Docs: https://zustand-demo.pmnd.rs/
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/

---

**Last Updated:** 2025-10-12
**Document Version:** 2.0
**Project Phase:** Phase 1 Complete - Phase 2 Ready to Start

---

## 🎯 Quick Start for New AI Session

To get up to speed quickly:

1. Read "Architecture Decisions" section
2. Review "What We've Built So Far"
3. Check "Next Steps"
4. Follow "Development Workflow"
5. Start coding with step-by-step approach

---

**Remember: This is a learning project. Always explain, never assume!**