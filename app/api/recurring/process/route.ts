import { NextResponse } from 'next/server';
import { processRecurringTransactionsUseCase } from '@/lib/domain/use-cases/process-recurring-transactions.use-case';

export async function POST() {
  try {
    const result = await processRecurringTransactionsUseCase.execute();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Recurring process error:', error);
    return NextResponse.json({ error: 'Failed to process recurring transactions' }, { status: 500 });
  }
}
