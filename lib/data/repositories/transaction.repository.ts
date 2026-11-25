import db from '../data-sources/sqlite.data-source';
import { Transaction } from '../../domain/entities/types';
import { getNextOccurrence } from '../../date-utils';
import { encrypt, decrypt } from '../../core/security/encryption.util';

/**
 * Repository for orchestrating database operations on Financial Transactions.
 * 
 * Implements the Repository pattern to isolate the SQLite layer from the 
 * rest of the application. Also handles auto-encryption/decryption of sensitive PII.
 * 
 * @module data/repositories/transaction
 */
export class TransactionRepository {
    /**
     * Retrieves all user transactions, automatically joining them with their 
     * respective category details for UI rendering context.
     * 
     * @returns {Promise<Transaction[]>} Array of joined and decrypted transactions.
     */
    async getAll(): Promise<Transaction[]> {
        const rows = db.prepare(`
      SELECT t.*, c.name as categoryName, c.color as categoryColor, c.iconName as categoryIcon
      FROM transactions t
      JOIN categories c ON t.categoryId = c.id
      ORDER BY t.date DESC
    `).all() as any[];

        // Transparent decryption of the PII 'name' field before the data 
        // ever reaches the Domain or Presentation layers.
        return rows.map((row) => ({
            ...row,
            name: decrypt(row.name),
        }));
    }

    /**
     * Inserts a new transaction into the database.
     * Automatically orchestrates the creation of a paired `recurring_transaction` rule
     * if the incoming payload flags it as recurring.
     * 
     * @param {any} payload - The transaction data payload from the API/UI.
     * @returns {Promise<void>}
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
     * Updates an existing transaction's properties.
     * Optionally propagates the changes up to the parent recurring rule if requested.
     * 
     * @param {string} id - The Unique ID of the transaction to modify.
     * @param {any} updates - The partial transaction object containing changes.
     * @returns {Promise<void>}
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
     * Permanently deletes a single transaction record from the database.
     * 
     * @param {string} id - The Unique ID of the target transaction.
     * @returns {Promise<void>}
     */
    async delete(id: string): Promise<void> {
        db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    }
}

export const transactionRepository = new TransactionRepository();
