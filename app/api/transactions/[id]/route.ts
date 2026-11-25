import { NextResponse } from 'next/server';
import { transactionRepository } from '@/lib/data/repositories/transaction.repository';

/**
 * PUT handler to update an existing financial transaction.
 * 
 * @param {Request} request - The incoming HTTP request with the partial/full Transaction payload.
 * @param {Object} context - The route context containing dynamic params.
 * @param {Promise<{ id: string }>} context.params - A promise resolving to the transaction ID.
 * @returns {Promise<NextResponse>} JSON success status or 500 on error.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await transactionRepository.update(id, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

/**
 * DELETE handler to remove a specific financial transaction.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} context - The route context containing dynamic params.
 * @param {Promise<{ id: string }>} context.params - A promise resolving to the transaction ID.
 * @returns {Promise<NextResponse>} JSON success status or 500 on error.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await transactionRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
