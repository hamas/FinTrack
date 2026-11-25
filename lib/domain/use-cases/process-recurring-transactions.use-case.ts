import db from '../../data/data-sources/sqlite.data-source';
import { getNextOccurrence } from '../../date-utils';
import { encrypt } from '../../core/security/encryption.util';

/**
 * Core Business Logic: Process Recurring Transactions
 * 
 * Interrogates the database for any recurring transaction patterns where the `nextDate` 
 * is less than or equal to the current UTC date. For each match, it mints a new 
 * transaction record and rolls the schedule forward.
 * 
 * @module domain/use-cases/process-recurring-transactions
 */
export class ProcessRecurringTransactionsUseCase {
    /**
     * Executes the daily recurring transaction sweep.
     * 
     * @returns {Promise<{ success: boolean; processed: number }>} Status and count of processed transactions.
     * @throws {Error} High-level error if the database query or transaction generation fails.
     */
    async execute(): Promise<{ success: boolean; processed: number }> {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Query all rules due up to and including 'today'
            const dueRecurring = db.prepare('SELECT * FROM recurring_transactions WHERE nextDate <= ?').all(today) as any[];

            // Iterate and synchronously generate the missing transactions
            for (const recurring of dueRecurring) {
                const txId = Math.random().toString(36).substr(2, 9);
                const encryptedName = recurring.name ? encrypt(recurring.name) : undefined;

                const insertTx = db.prepare('INSERT INTO transactions (id, name, amount, date, categoryId, isRecurring, frequency, recurringId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
                insertTx.run(txId, encryptedName, recurring.amount, recurring.nextDate, recurring.categoryId, 1, recurring.frequency, recurring.id);

                const metadata = recurring.metadata ? JSON.parse(recurring.metadata) : null;
                
                // Calculate the true next occurrence based on complex calendrical rules
                const nextDate = getNextOccurrence(recurring.nextDate, recurring.frequency, metadata, recurring.endDate);

                // If a valid next date exists, advance the rule. Otherwise, auto-terminate it.
                if (nextDate) {
                    const updateRecurring = db.prepare('UPDATE recurring_transactions SET nextDate = ? WHERE id = ?');
                    updateRecurring.run(nextDate, recurring.id);
                } else {
                    const deleteRecurring = db.prepare('DELETE FROM recurring_transactions WHERE id = ?');
                    deleteRecurring.run(recurring.id);
                }
            }

            return { success: true, processed: dueRecurring.length };
        } catch (error) {
            console.error('Recurring process error:', error);
            throw new Error('Failed to process recurring transactions');
        }
    }
}

export const processRecurringTransactionsUseCase = new ProcessRecurringTransactionsUseCase();
