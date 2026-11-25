/**
 * AES-256-GCM Encryption Utilities
 * 
 * Provides robust symmetrical encryption and decryption functionality
 * for securing sensitive data at rest in the SQLite database.
 * 
 * @module core/security/encryption
 */

import crypto from 'crypto';
import { env } from '../config/env.config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a consistent, 32-byte encryption key asynchronously from the 
 * environment secret using the robust scrypt key derivation function.
 * 
 * @returns {Buffer} A 32-byte (256-bit) buffer safe for AES-256-GCM encryption.
 */
const getKey = (): Buffer => {
    return crypto.scryptSync(env.ENCRYPTION_KEY || 'default_dev_key_must_change', 'salt', KEY_LENGTH);
};

/**
 * Encrypts a sensitive string using AES-256-GCM.
 * Automatically generates a secure random Initialization Vector (IV) and Authentication Tag.
 * 
 * @param {string} text - The plain text to encrypt.
 * @returns {string} Base64 encoded cyphertext format: `iv:tag:encryptedText`.
 */
export const encrypt = (text: string): string => {
    if (!text) return text;

    // Generate a unique IV for every encryption payload to prevent pattern analysis
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag();

    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
};

/**
 * Decrypts an AES-256-GCM encrypted string back to plaintext.
 * Validates the Authentication Tag to ensure the cyphertext has not been tampered with.
 * 
 * @param {string} encryptedText - The formatted encrypted string: `iv:tag:encryptedText`.
 * @returns {string} The original plain text, or a failure warning if decryption fails.
 */
export const decrypt = (encryptedText: string): string => {
    // Return early if the text doesn't conform to the expected format
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
