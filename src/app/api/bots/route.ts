// src/app/api/bots/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';        // استعمل نسخة Prisma الموحّدة

export async function GET() {
  try {
    const bots = await prisma.bot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { username: true } }, // اسم منشئ البوت
        // إذا عندك likesCount حقل في Bot يكفي، غير كذا فعّل السطر تحت لحسابها ديناميكياً
        // _count: { select: { likes: true } },
      },
    });

    return NextResponse.json(bots);
  } catch (err) {
    console.error('Error fetching bots:', err);
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
  }
}
