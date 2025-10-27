# DreamSoft Sales & Inventory Management - Project Context

## Project Overview

**Name:** DreamSoft WebApp
**Type:** Sales & Inventory Management Application
**Tech Stack:** React 19 + TypeScript + Vite
**Architecture:** Feature-Sliced Design (FSD) with Data-Driven Structure
**Color Scheme:** Modern Teal (Primary: Teal, Secondary: Slate, Accent: Cyan)

## Project Goals

1. Build a scalable, maintainable sales and inventory management system
2. Follow modern React best practices and architectural patterns
3. Implement a clean separation between server state and client state
4. Create a professional, modern UI with a consistent teal color scheme
5. Ensure type safety with TypeScript throughout the application

## Current Project Structure

```
src/
├── app/                      # Application layer
│   └── router/              # Routing configuration
│       ├── index.tsx        # Main router with all routes
│       ├── ProtectedRoute.tsx   # Auth guard for protected routes
│       └── PublicRoute.tsx      # Guard for public-only routes
│
├── data/                    # Data layer
│   ├── remote/             # Remote data (API, server state)
│   │   ├── api/
│   │   │   └── client.ts   # Axios instance with interceptors
│   │   └── providers/
│   │       └── QueryProvider.tsx  # React Query provider
│   │
│   └── local/              # Local data (storage, client state)
│       └── stores/
│           └── ui.store.ts # Zustand store for UI state
│
├── features/               # Feature modules (to be built)
├── shared/                 # Shared utilities (to be built)
├── styles/                 # Styling configuration
│   └── COLOR_GUIDE.md     # Color scheme documentation
│
├── App.tsx                 # Root component
├── main.tsx               # Application entry point
└── index.css              # Global styles with Tailwind

Root files:
├── .env                    # Environment variables (not committed)
├── .env.example           # Environment template
└── tailwind.config.js     # Tailwind configuration with custom colors
```

## Technology Stack

### Core
- **React 19.0.0** - UI library with latest features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and dev server

### Routing
- **React Router v7.1.3** - Client-side routing
- Route guards: `ProtectedRoute`, `PublicRoute`

### State Management
- **React Query (TanStack Query)** - Server state management
  - Automatic caching and background updates
  - staleTime: 5 minutes
  - gcTime: 10 minutes
  - Automatic retries for queries
- **Zustand** - Client/UI state management
  - Sidebar state (open/collapsed)
  - Theme (light/dark)
  - Global loading state
  - localStorage persistence for theme and sidebar preferences

### HTTP Client
- **Axios** - API communication
- Custom client with interceptors:
  - Request: Adds Bearer token from localStorage
  - Response: Handles 401 (logout), 404, 500 errors
- Timeout: 15 seconds
- Base URL: Configurable via environment variables

### UI Framework
- **PrimeReact** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- Custom color scheme with semantic naming

### Icons
- **PrimeIcons** - Icon library

## Color Scheme: Modern Teal

### Primary Colors (Teal)
- Range: `primary-50` through `primary-950`
- Main: `primary-500` (#14b8a6)
- Used for: Primary actions, main navigation, brand elements

### Secondary Colors (Slate)
- Range: `secondary-50` through `secondary-950`
- Main: `secondary-500` (#64748b)
- Used for: Secondary actions, backgrounds, neutral elements

### Accent Colors (Cyan)
- Range: `accent-50` through `accent-950`
- Main: `accent-500` (#06b6d4)
- Used for: Highlights, special features, call-to-action

### Semantic Colors
- **Success:** Green (#10b981)
- **Warning:** Amber (#f59e0b)
- **Error:** Red (#ef4444)
- **Info:** Blue (#3b82f6)

### Shadows & Effects
- Card shadow: `shadow-card` (custom defined)
- Smooth transitions on interactive elements

## App Layer Implementation

### 1. Environment Configuration (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=15000
VITE_APP_NAME=DreamSoft
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### 2. API Client (src/data/remote/api/client.ts)
- Centralized Axios instance
- Request interceptor: Adds authentication token
- Response interceptor: Global error handling
- Automatic logout on 401 responses

### 3. React Query Provider (src/data/remote/providers/QueryProvider.tsx)
- Wraps app with React Query context
- Configured with optimal cache settings
- Includes dev tools in development mode

### 4. UI Store (src/data/local/stores/ui.store.ts)
- Zustand store for client-side state
- Manages sidebar, theme, and loading states
- Persists theme and sidebar collapsed state
- Helper hooks: `useSidebarState()`, `useThemeState()`
- Initialize function: `initializeTheme()`

### 5. Router Configuration (src/app/router/)
- **ProtectedRoute:** Requires authentication
- **PublicRoute:** Only accessible when not authenticated
- Routes:
  - `/` → Redirects to `/dashboard`
  - `/login` → Public route (temporary login page)
  - `/dashboard` → Protected (temporary dashboard)
  - `/sales` → Protected (placeholder)
  - `/inventory` → Protected (placeholder)
  - `/customers` → Protected (placeholder)
  - `/reports` → Protected (placeholder)
  - `*` → 404 Not Found

### 6. App.tsx
- Wires QueryProvider and RouterProvider
- Initializes theme on mount
- Entry point for the entire application

### 7. TypeScript Configuration
- Path aliases configured: `@/*` maps to `./src/*`
- Strict mode enabled
- ES2022 target with DOM libraries

## Authentication Flow

1. **Initial Load:**
   - Check for `authToken` in localStorage
   - If no token → Redirect to `/login`
   - If token exists → Allow access to protected routes

2. **Login:**
   - User submits credentials (temporary: demo button)
   - Token saved to localStorage
   - Redirect to `/dashboard`

3. **Protected Routes:**
   - `ProtectedRoute` checks for token
   - If no token → Redirect to `/login`
   - If token exists → Render route content

4. **Logout:**
   - Remove `authToken` from localStorage
   - Redirect to `/login`

5. **API Requests:**
   - Axios interceptor adds token to all requests
   - On 401 response → Auto-logout and redirect to login

## Recent Changes

### Session 1: App Layer Setup
- ✅ Created environment configuration (`.env`, `.env.example`)
- ✅ Built API client with Axios and interceptors
- ✅ Implemented React Query provider with optimal caching
- ✅ Created Zustand UI store with localStorage persistence
- ✅ Built route guards (`ProtectedRoute`, `PublicRoute`)
- ✅ Configured router with all main routes
- ✅ Wired everything together in `App.tsx`
- ✅ Added path aliases to TypeScript configuration
- ✅ Created temporary pages for testing authentication flow

## Next Steps

### Immediate
- [ ] Test complete authentication flow (login → dashboard → logout)
- [ ] Update PROJECT_CONTEXT.md as features are built
- [ ] Create git commit for App Layer setup

### Features to Build
- [ ] Real authentication feature (login/register forms, API integration)
- [ ] Dashboard with real data and widgets
- [ ] Sales management module
- [ ] Inventory management module
- [ ] Customer management module
- [ ] Reports and analytics module

### Shared Components
- [ ] Layout component (header, sidebar, main content)
- [ ] Form components
- [ ] Table components
- [ ] Modal/Dialog components
- [ ] Loading states and error boundaries

## Development Workflow

1. **Start dev server:** `npm run dev`
2. **Build for production:** `npm run build`
3. **Preview production build:** `npm run preview`
4. **Lint code:** `npm run lint`

## Important Notes

- Always update this document when making structural changes
- Follow step-by-step approach: explain → show code → confirm → implement
- Use semantic commit messages
- Keep separation between server state (React Query) and client state (Zustand)
- Use path aliases (`@/`) instead of relative imports
- Persist only necessary UI state to localStorage

## Git Workflow

- **Main branch:** `master`
- **Development branch:** `dev-features`
- Current untracked changes: `.env`, `.env.example`, `src/data/` folder
- Commit after each major feature completion

---

**Last Updated:** 2025-10-21
**Current Status:** App Layer setup complete, ready for feature development
