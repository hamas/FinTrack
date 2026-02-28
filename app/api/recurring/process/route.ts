import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getNextOccurrence } from '@/lib/date-utils';

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dueRecurring = db.prepare('SELECT * FROM recurring_transactions WHERE nextDate <= ?').all(today) as any[];

    for (const recurring of dueRecurring) {
      // Create new transaction
      const txId = Math.random().toString(36).substr(2, 9);
      const insertTx = db.prepare('INSERT INTO transactions (id, name, amount, date, categoryId, isRecurring, frequency, recurringId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      insertTx.run(txId, recurring.name, recurring.amount, recurring.nextDate, recurring.categoryId, 1, recurring.frequency, recurring.id);

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

    return NextResponse.json({ success: true, processed: dueRecurring.length });
  } catch (error) {
    console.error('Recurring process error:', error);
    return NextResponse.json({ error: 'Failed to process recurring transactions' }, { status: 500 });
  }
}
