/**
 * UI Store
 *
 * Global state management for UI-related state using Zustand.
 * This store manages app-wide UI state like sidebar, theme, etc.
 *
 * Why Zustand?
 * - Simple and lightweight
 * - No boilerplate (unlike Redux)
 * - TypeScript friendly
 * - Works outside React components
 * - Automatic localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme types
 */
export type Theme = 'light' | 'dark';

/**
 * UI Store State Interface
 */
interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Theme
  theme: Theme;

  // Loading states
  isGlobalLoading: boolean;

  // Sidebar Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Theme Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Loading Actions
  setGlobalLoading: (loading: boolean) => void;
}

/**
 * Create the UI Store
 *
 * persist() middleware saves state to localStorage
 * so it persists across page refreshes
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // ========================================
      // INITIAL STATE
      // ========================================
      isSidebarOpen: true,           // Sidebar starts visible
      isSidebarCollapsed: false,     // Sidebar starts in full-width mode
      theme: 'light',                // Default theme is light
      isGlobalLoading: false,        // No loading by default

      // ========================================
      // SIDEBAR ACTIONS
      // ========================================

      /**
       * Toggle sidebar open/closed
       */
      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      /**
       * Set sidebar open state explicitly
       */
      setSidebarOpen: (open) =>
        set(() => ({
          isSidebarOpen: open,
        })),

      /**
       * Toggle sidebar between full-width and icon-only
       */
      toggleSidebarCollapse: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),

      /**
       * Set sidebar collapsed state explicitly
       */
      setSidebarCollapsed: (collapsed) =>
        set(() => ({
          isSidebarCollapsed: collapsed,
        })),

      // ========================================
      // THEME ACTIONS
      // ========================================

      /**
       * Set theme (light or dark)
       * Also updates DOM attribute for CSS styling
       */
      setTheme: (theme) => {
        // Update state
        set(() => ({ theme }));

        // Update DOM attribute for CSS
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute(
            'content',
            theme === 'dark' ? '#111827' : '#ffffff'
          );
        }
      },

      /**
       * Toggle between light and dark theme
       */
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // ========================================
      // LOADING ACTIONS
      // ========================================

      /**
       * Set global loading state
       */
      setGlobalLoading: (loading) =>
        set(() => ({
          isGlobalLoading: loading,
        })),
    }),
    {
      name: 'dreamsoft-ui-storage', // localStorage key name
      partialize: (state) => ({
        // Only persist these values to localStorage
        isSidebarCollapsed: state.isSidebarCollapsed,
        theme: state.theme,
        // isSidebarOpen and isGlobalLoading are NOT persisted
        // They reset on page refresh
      }),
    }
  )
);

/**
 * Initialize theme on app load
 *
 * Call this in your main.tsx or App.tsx
 */
export const initializeTheme = () => {
  const theme = useUIStore.getState().theme;
  document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Helper hook to get only sidebar state
 *
 * Usage: const sidebar = useSidebarState();
 *
 * Better performance - component only re-renders when sidebar state changes
 */
export const useSidebarState = () =>
  useUIStore((state) => ({
    isOpen: state.isSidebarOpen,
    isCollapsed: state.isSidebarCollapsed,
    toggle: state.toggleSidebar,
    setOpen: state.setSidebarOpen,
    toggleCollapse: state.toggleSidebarCollapse,
    setCollapsed: state.setSidebarCollapsed,
  }));

/**
 * Helper hook to get only theme state
 *
 * Usage: const { theme, toggleTheme } = useThemeState();
 *
 * Better performance - component only re-renders when theme changes
 */
export const useThemeState = () =>
  useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));

/**
 * Usage Examples:
 *
 * // In any component:
 * import { useUIStore, useSidebarState, useThemeState } from '@/data/local/stores/ui.store';
 *
 * // Option 1: Use entire store
 * const { isSidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();
 *
 * // Option 2: Use specific parts (better performance)
 * const sidebar = useSidebarState();
 * const { theme, toggleTheme } = useThemeState();
 *
 * // In your component:
 * <button onClick={sidebar.toggle}>Toggle Sidebar</button>
 * <button onClick={toggleTheme}>Toggle Theme</button>
 */

export default useUIStore;


