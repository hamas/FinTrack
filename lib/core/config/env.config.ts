/**
 * Secure environment variable loader validating .env keys.
 * Ensures that the application fails fast if critical secrets are missing.
 */

interface EnvConfig {
    NODE_ENV: 'development' | 'production' | 'test';
    ENCRYPTION_KEY: string;
    GOOGLE_GENAI_API_KEY: string | undefined;
}

const loadEnv = (): EnvConfig => {
    const isProd = process.env.NODE_ENV === 'production';

    const config: EnvConfig = {
        NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
        GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
    };

    if (isProd && !config.ENCRYPTION_KEY) {
        throw new Error('CRITICAL ERROR: ENCRYPTION_KEY environment variable is missing in production.');
    }

    // Provide a fallback in local dev if missing to prevent immediate crash, though typically bad practice.
    if (!isProd && !config.ENCRYPTION_KEY) {
        console.warn('WARNING: ENCRYPTION_KEY is missing. Using a default insecure key for development.');
        config.ENCRYPTION_KEY = 'fintrack_local_dev_insecure_key_1234567890';
    }

    return config;
};

export const env = loadEnv();
