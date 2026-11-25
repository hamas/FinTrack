import { NextResponse } from 'next/server';
import { transactionRepository } from '@/lib/data/repositories/transaction.repository';

/**
 * GET handler to retrieve all financial transactions.
 * Fetches transactions from the underlying repository data source.
 * 
 * @returns {Promise<NextResponse>} JSON array of Transaction objects or 500 on error.
 */
export async function GET() {
  try {
    const transactions = await transactionRepository.getAll();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

/**
 * POST handler to create a new financial transaction.
 * Also handles creating recurring rule metadata if the transaction is marked as recurring.
 * 
 * @param {Request} request - The incoming HTTP request containing the Transaction payload.
 * @returns {Promise<NextResponse>} JSON success status or 500 on error.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await transactionRepository.create(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
