import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import type { ParsedUrlQuery } from 'querystring';

const prisma = new PrismaClient();

interface BotParams extends ParsedUrlQuery {
  botId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: BotParams; searchParams?: never }
) {
  const { botId } = context.params;

  try {
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error fetching bot by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
