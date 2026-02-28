import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, amount, date, categoryId, updateRecurring } = body;

    // Update the transaction
    const updateTx = db.prepare('UPDATE transactions SET name = ?, amount = ?, date = ?, categoryId = ? WHERE id = ?');
    updateTx.run(name, amount, date, categoryId, id);

    // If it's linked to a recurring rule and user wants to update the rule too
    if (updateRecurring) {
      const tx = db.prepare('SELECT recurringId FROM transactions WHERE id = ?').get() as { recurringId?: string };
      if (tx?.recurringId) {
        const updateRule = db.prepare('UPDATE recurring_transactions SET name = ?, amount = ?, categoryId = ? WHERE id = ?');
        updateRule.run(name, amount, categoryId, tx.recurringId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
