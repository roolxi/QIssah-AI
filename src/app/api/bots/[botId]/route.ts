import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const { botId } = params;

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
