import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, iconName, color, type, budget } = body;
    const insert = db.prepare('INSERT INTO categories (id, name, iconName, color, type, budget) VALUES (?, ?, ?, ?, ?, ?)');
    insert.run(id, name, iconName, color, type, budget);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
