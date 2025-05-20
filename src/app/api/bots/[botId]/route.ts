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

    return NextResponse.json(bot);
  } catch (err) {
    console.error('Error fetching bot:', err);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}
