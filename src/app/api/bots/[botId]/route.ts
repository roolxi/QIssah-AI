import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, context: any) {
  const { botId } = context.params;

  try {
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        creator: { select: { username: true } },
      },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    // زيادة العداد لو تبغى
    await prisma.bot.update({
      where: { id: botId },
      data: { viewsCount: { increment: 1 } },
    });

    return NextResponse.json({
      id: bot.id,
      name: bot.name,
      description: bot.description,
      image: bot.image,
      personality: bot.personality,
      accent: bot.accent,
      likesCount: bot.likesCount,
      viewsCount: bot.viewsCount,
      creator: {
        username: bot.creator?.username || 'Unknown',
      },
    });
  } catch (err) {
    console.error('Error fetching bot:', err);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}
