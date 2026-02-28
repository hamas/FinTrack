import db from '../../data/data-sources/sqlite.data-source';
import { getNextOccurrence } from '../../date-utils';
import { encrypt } from '../../core/security/encryption.util';

/**
 * Use Case: Processes recurring transactions that are due.
 * Generates new transaction records and updates the nextDate of the recurring rule.
 */
export class ProcessRecurringTransactionsUseCase {
    async execute(): Promise<{ success: boolean; processed: number }> {
        try {
            const today = new Date().toISOString().split('T')[0];
            const dueRecurring = db.prepare('SELECT * FROM recurring_transactions WHERE nextDate <= ?').all(today) as any[];

            for (const recurring of dueRecurring) {
                // Create new transaction
                const txId = Math.random().toString(36).substr(2, 9);
                const encryptedName = recurring.name ? encrypt(recurring.name) : undefined;

                const insertTx = db.prepare('INSERT INTO transactions (id, name, amount, date, categoryId, isRecurring, frequency, recurringId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
                insertTx.run(txId, encryptedName, recurring.amount, recurring.nextDate, recurring.categoryId, 1, recurring.frequency, recurring.id);

                // Update nextDate for recurring transaction
                const metadata = recurring.metadata ? JSON.parse(recurring.metadata) : null;
                const nextDate = getNextOccurrence(recurring.nextDate, recurring.frequency, metadata, recurring.endDate);

                if (nextDate) {
                    const updateRecurring = db.prepare('UPDATE recurring_transactions SET nextDate = ? WHERE id = ?');
                    updateRecurring.run(nextDate, recurring.id);
                } else {
                    // No more occurrences, delete the recurring rule
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
