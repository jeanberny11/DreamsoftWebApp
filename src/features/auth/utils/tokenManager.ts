/**
 * Token Manager
 *
 * Location: src/features/auth/utils/tokenManager.ts
 *
 * Manages access token in memory (NOT localStorage).
 * More secure as tokens are cleared on page refresh/tab close.
 * Refresh token is handled via HttpOnly cookies by the backend.
 */

// ========================================
// IN-MEMORY TOKEN STORAGE
// ========================================

let accessToken: string | null = null;

// ========================================
// TOKEN MANAGER
// ========================================

export const tokenManager = {
  /**
   * Get the current access token from memory
   * @returns Access token or null
   */
  getAccessToken(): string | null {
    return accessToken;
  },

  /**
   * Set access token in memory
   * @param token - The access token to store
   */
  setAccessToken(token: string): void {
    accessToken = token;
  },

  /**
   * Clear access token from memory
   */
  clearAccessToken(): void {
    accessToken = null;
  },

  /**
   * Check if access token exists
   * @returns True if token exists
   */
  hasAccessToken(): boolean {
    return accessToken !== null && accessToken !== '';
  },
};

export default tokenManager;
