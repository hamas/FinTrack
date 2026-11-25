import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.config';
import { sanitizeForAI } from './sanitization.util';

/**
 * Singleton service for interacting with Google's Gemini LLM.
 * 
 * Used for processing financial data, generating budgeting advice,
 * and performing automated classification on user transactions.
 * 
 * @module core/ai/gemini
 */
class GeminiService {
    /** The active SDK instance for internal usage */
    private ai: GoogleGenAI | null = null;
    /** The target foundation model used for all project reasoning */
    public readonly MODEL_ID = 'gemini-2.5-flash';

    constructor() {
        this.init();
    }

    /**
     * Initializes the connection to the Google Generative AI APIs.
     * Silently disables functionality if the API key is not present in the environment limits.
     * @private
     */
    private init() {
        if (env.GOOGLE_GENAI_API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
        } else {
            console.warn(`[GeminiService] GOOGLE_GENAI_API_KEY is not set. AI features will be disabled.`);
        }
    }

    /**
     * Sends a prompt and associated financial context to Gemini for evaluation.
     * Before transmittal, the context and prompt natively pass through the `sanitizeForAI` scrubber.
     * 
     * @param {string} prompt - The direct question or command from the user.
     * @param {Record<string, unknown> | unknown[]} context - The relevant financial data array or object.
     * @returns {Promise<string | null>} The text response from the LLM, or null if empty.
     * @throws {Error} Throws if the API key is missing or the external network call outright fails.
     */
    async generateFinancialInsight(prompt: string, context: Record<string, unknown> | unknown[]): Promise<string | null> {
        if (!this.ai) {
            throw new Error('Gemini Service is unavailable due to missing API key.');
        }

        try {
            const sanitizedContext = sanitizeForAI(context);
            const sanitizedPrompt = sanitizeForAI(prompt);

            const systemInstruction = `You are a financial advisor AI analyzing FinTrack transaction data. Be concise, precise, and focus on savings optimization. Context data: ${JSON.stringify(sanitizedContext)}`;

            const ai = this.ai;
            if (!ai) throw new Error('AI client instance is missing.');

            const response = await (ai as any).models.generateContent({
                model: this.MODEL_ID,
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: sanitizedPrompt }]
                    }
                ],
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            return response.text || null;
        } catch (error) {
            console.error('[GeminiService] Failed to generate insight:', error);
            throw error;
        }
    }
}

export const geminiService = new GeminiService();
