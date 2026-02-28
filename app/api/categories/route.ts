import { NextResponse } from 'next/server';
import { categoryRepository } from '@/lib/data/repositories/category.repository';

export async function GET() {
  try {
    const categories = await categoryRepository.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await categoryRepository.create(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
