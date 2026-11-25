import { NextResponse } from 'next/server';
import { processRecurringTransactionsUseCase } from '@/lib/domain/use-cases/process-recurring-transactions.use-case';

/**
 * POST handler to manually trigger the evaluation of all recurring transactions.
 * Orchestrates the execution of the `ProcessRecurringTransactionsUseCase` 
 * to advance rules and instantiate due transactions.
 * 
 * @returns {Promise<NextResponse>} JSON status payload showing execution result or 500 on error.
 */
export async function POST() {
  try {
    const result = await processRecurringTransactionsUseCase.execute();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Recurring process error:', error);
    return NextResponse.json({ error: 'Failed to process recurring transactions' }, { status: 500 });
  }
}
