import { NextResponse } from 'next/server';
import { transactionRepository } from '@/lib/data/repositories/transaction.repository';

export async function GET() {
  try {
    const transactions = await transactionRepository.getAll();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

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
