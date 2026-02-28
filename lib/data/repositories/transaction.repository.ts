import db from '../data-sources/sqlite.data-source';
import { Transaction } from '../../domain/entities/types';
import { getNextOccurrence } from '../../date-utils';
import { encrypt, decrypt } from '../../core/security/encryption.util';

/**
 * Handles database operations for Financial Transactions.
 */
export class TransactionRepository {
    /**
     * Retrieves all transactions merged with their respective category details.
     */
    async getAll(): Promise<Transaction[]> {
        const rows = db.prepare(`
      SELECT t.*, c.name as categoryName, c.color as categoryColor, c.iconName as categoryIcon
      FROM transactions t
      JOIN categories c ON t.categoryId = c.id
      ORDER BY t.date DESC
    `).all() as any[];

        // Decrypt names before returning to client (Example of the AES implementation)
        return rows.map((row) => ({
            ...row,
            name: decrypt(row.name),
        }));
    }

    /**
     * Inserts a new transaction. Generates recurring transactions automatically if enabled.
     */
    async create(payload: any): Promise<void> {
        const { id, name, amount, date, categoryId, isRecurring, frequency, endDate, metadata } = payload;

        // Encrypt sensitive name before insertion
        const encryptedName = encrypt(name);

        let recurringId = null;
        if (isRecurring && frequency) {
            recurringId = Math.random().toString(36).substr(2, 9);
            const nextDate = getNextOccurrence(date, frequency, metadata, endDate);

            if (nextDate) {
                const insertRecurring = db.prepare('INSERT INTO recurring_transactions (id, name, amount, categoryId, frequency, nextDate, endDate, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
                insertRecurring.run(recurringId, encryptedName, amount, categoryId, frequency, nextDate, endDate || null, metadata ? JSON.stringify(metadata) : null);
            }
        }

        const insertTx = db.prepare('INSERT INTO transactions (id, name, amount, date, categoryId, isRecurring, frequency, recurringId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        insertTx.run(id, encryptedName, amount, date, categoryId, isRecurring ? 1 : 0, frequency || null, recurringId);
    }

    /**
     * Updates an existing transaction by id.
     */
    async update(id: string, updates: any): Promise<void> {
        const { name, amount, date, categoryId, updateRecurring } = updates;
        const encryptedName = name ? encrypt(name) : undefined;

        const updateTx = db.prepare('UPDATE transactions SET name = ?, amount = ?, date = ?, categoryId = ? WHERE id = ?');
        updateTx.run(encryptedName, amount, date, categoryId, id);

        if (updateRecurring) {
            const tx = db.prepare('SELECT recurringId FROM transactions WHERE id = ?').get(id) as { recurringId?: string };
            if (tx?.recurringId) {
                const updateRule = db.prepare('UPDATE recurring_transactions SET name = ?, amount = ?, categoryId = ? WHERE id = ?');
                updateRule.run(encryptedName, amount, categoryId, tx.recurringId);
            }
        }
    }

    /**
     * Deletes a transaction by id.
     */
    async delete(id: string): Promise<void> {
        db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    }
}

export const transactionRepository = new TransactionRepository();
