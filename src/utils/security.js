/**
 * Security utilities for FlexiSite CMS
 */

/**
 * Hashes a string using SHA-256
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function hashApiKey(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Generates a crypto-safe random API key with prefix
 * @returns {string}
 */
export function generateRawKey() {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    const hex = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return `fs_live_${hex}`;
}
