import { NextResponse } from 'next/server';
import { categoryRepository } from '@/lib/data/repositories/category.repository';

/**
 * PUT handler to update an existing financial category.
 * 
 * @param {Request} request - The incoming HTTP request with the partial/full Category payload.
 * @param {Object} context - The route context containing dynamic params.
 * @param {Promise<{ id: string }>} context.params - A promise resolving to the category ID.
 * @returns {Promise<NextResponse>} JSON success status or 500 on error.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await categoryRepository.update(id, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

/**
 * DELETE handler to remove a specific financial category.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} context - The route context containing dynamic params.
 * @param {Promise<{ id: string }>} context.params - A promise resolving to the category ID.
 * @returns {Promise<NextResponse>} JSON success status or 500 on error.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await categoryRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
