/**
 * Utility to sanitize data before sending to External APIs (like Gemini).
 * Prevents PII leakage and protects against prompt injection by stripping/masking sensitive fields.
 */

export const sanitizeForAI = (data: any): any => {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
        return data.map(item => sanitizeForAI(item));
    }

    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Mask specific sensitive keys
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

    // Sanitize strings to prevent prompt injection attempts (basic stripping of control sequences)
    if (typeof data === 'string') {
        return data.replace(/[<>]/g, '').slice(0, 1000); // Basic strip and length limit
    }

    return data;
};
