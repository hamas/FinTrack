import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.config';
import { sanitizeForAI } from './sanitization.util';

/**
 * Singleton service handling the connection to Google Gemini models.
 * Used for financial data reasoning, automated categorization, and budgeting advice.
 */
class GeminiService {
    private ai: GoogleGenAI | null = null;
    public readonly MODEL_ID = 'gemini-2.5-flash';

    constructor() {
        this.init();
    }

    private init() {
        if (env.GOOGLE_GENAI_API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
        } else {
            console.warn(`[GeminiService] GOOGLE_GENAI_API_KEY is not set. AI features will be disabled.`);
        }
    }

    /**
     * Generates insight or categorization based on transaction history and prompt.
     * Prompts the chosen 2.5 Flash model for fast, structured reasoning.
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

            // Using the v1.43.0 approach: call generateContent directly from the models module
            // as discovered in the SDK's genai.d.ts (line 7469)
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
