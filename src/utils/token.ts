// src/utils/token.ts

const TOKEN_KEY: string = 'token_key';

/**
 * Sets the token in localStorage.
 * @param token - The authentication token to store.
 */
export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieves the token from localStorage.
 * @returns The stored token or null if not found.
 */
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Removes the token from localStorage.
 */
export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}
