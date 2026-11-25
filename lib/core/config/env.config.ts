/**
 * Secure environment variable loader and validator.
 * 
 * This module ensures the application fails fast during initialization
 * if critical secrets (like encryption keys) are missing, preventing
 * insecure deployments.
 * 
 * @module core/config/env
 */

/**
 * Defines the expected shape of the application's environment configuration.
 * @interface EnvConfig
 */
interface EnvConfig {
    /** The current running environment (e.g., 'development' or 'production') */
    NODE_ENV: 'development' | 'production' | 'test';
    /** The 32-byte minimum secret key used for AES-256-GCM database encryption */
    ENCRYPTION_KEY: string;
    /** The API key for Google's Gemini AI services (Optional) */
    GOOGLE_GENAI_API_KEY: string | undefined;
}

/**
 * Instantiates and validates the environment configuration object.
 * Checks for strict compliance in production environments.
 * 
 * @returns {EnvConfig} A validated configuration object populated from `process.env`.
 * @throws {Error} If a mandatory key is missing in production.
 */
const loadEnv = (): EnvConfig => {
    const isProd = process.env.NODE_ENV === 'production';

    const config: EnvConfig = {
        NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
        GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
    };

    // Enforce strict security checks during production deployments
    if (isProd && !config.ENCRYPTION_KEY) {
        throw new Error('CRITICAL ERROR: ENCRYPTION_KEY environment variable is missing in production.');
    }

    // Gracefully handle local development environments by injecting a mock key
    if (!isProd && !config.ENCRYPTION_KEY) {
        console.warn('WARNING: ENCRYPTION_KEY is missing. Using a default insecure key for development.');
        config.ENCRYPTION_KEY = 'fintrack_local_dev_insecure_key_1234567890';
    }

    return config;
};

export const env = loadEnv();
