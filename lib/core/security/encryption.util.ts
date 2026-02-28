import crypto from 'crypto';
import { env } from '../config/env.config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a consistent encryption key from the environment secret
 */
const getKey = (): Buffer => {
    return crypto.scryptSync(env.ENCRYPTION_KEY || 'default_dev_key_must_change', 'salt', KEY_LENGTH);
};

/**
 * Encrypts a sensitive string using AES-256-GCM.
 * @param text The plain text to encrypt
 * @returns Base64 encoded encrypted string format: iv:tag:encryptedText
 */
export const encrypt = (text: string): string => {
    if (!text) return text;

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag();

    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
};

/**
 * Decrypts an AES-256-GCM encrypted string.
 * @param encryptedText The encrypted string format: iv:tag:encryptedText
 * @returns The original plain text
 */
export const decrypt = (encryptedText: string): string => {
    if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

    try {
        const [ivBase64, tagBase64, encryptedBase64] = encryptedText.split(':');
        if (!ivBase64 || !tagBase64 || !encryptedBase64) return encryptedText;

        const iv = Buffer.from(ivBase64, 'base64');
        const tag = Buffer.from(tagBase64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption failed', error);
        return '***DECRYPTION FAILED***';
    }
};
