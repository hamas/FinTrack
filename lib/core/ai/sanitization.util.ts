/**
 * AI Data Sanitization Utilities
 * 
 * Provides methods to scrub Personal Identifiable Information (PII) 
 * and prevent prompt-injection attacks before transmitting data to external LLMs.
 * 
 * @module core/ai/sanitization
 */

/**
 * Recursively traverses a data object and masks sensitive fields, while optionally 
 * stripping potentially malicious HTML/XML syntax from string payloads.
 * 
 * @param {any} data - The raw payload (string, object, or array) to be sanitized.
 * @returns {any} A deeply cloned and sanitized version of the payload safe for LLM context.
 */
export const sanitizeForAI = (data: any): any => {
    // Base case: return primitives transparently
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
        return data.map(item => sanitizeForAI(item));
    }

    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Rule: Explicitly target and mask known PII and free-text fields
                if (['name', 'description', 'notes', 'memo'].includes(key.toLowerCase())) {
                    sanitized[key] = '[MASKED_SENSITIVE_TEXT]';
                }
                // Recursively sanitize nested objects
                else {
                    sanitized[key] = sanitizeForAI(data[key]);
                }
            }
        }
        return sanitized;
    }

    // Rule: Strip arbitrary bracket chars to prevent XML injection in system prompts
    if (typeof data === 'string') {
        return data.replace(/[<>]/g, '').slice(0, 1000);
    }

    return data;
};
