import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getNextOccurrence } from '@/lib/date-utils';

export async function GET() {
  try {
    const transactions = db.prepare(`
      SELECT t.*, c.name as categoryName, c.color as categoryColor, c.iconName as categoryIcon
      FROM transactions t
      JOIN categories c ON t.categoryId = c.id
      ORDER BY t.date DESC
    `).all();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, amount, date, categoryId, isRecurring, frequency, endDate, metadata } = body;
    
    let recurringId = null;
    if (isRecurring && frequency) {
      recurringId = Math.random().toString(36).substr(2, 9);
      const nextDate = getNextOccurrence(date, frequency, metadata, endDate);
      
      if (nextDate) {
        const insertRecurring = db.prepare('INSERT INTO recurring_transactions (id, name, amount, categoryId, frequency, nextDate, endDate, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        insertRecurring.run(recurringId, name, amount, categoryId, frequency, nextDate, endDate || null, metadata ? JSON.stringify(metadata) : null);
      }
    }

    const insertTx = db.prepare('INSERT INTO transactions (id, name, amount, date, categoryId, isRecurring, frequency, recurringId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    insertTx.run(id, name, amount, date, categoryId, isRecurring ? 1 : 0, frequency || null, recurringId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
