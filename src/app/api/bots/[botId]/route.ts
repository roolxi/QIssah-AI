import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { botId } = req.query;

  try {
    const bot = await prisma.bot.findUnique({
      where: {
        id: botId as string,
      },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    return res.status(200).json(bot);
  } catch (error) {
    console.error('Error fetching bot by ID:', error);
    return res.status(500).json({ error: 'Failed to fetch bot' });
  } finally {
    await prisma.$disconnect();
  }
}
