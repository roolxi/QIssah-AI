import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(cats);
}
