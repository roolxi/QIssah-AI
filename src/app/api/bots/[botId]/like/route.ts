import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPayload } from '@/lib/getPayload';

/* POST = إضافة إعجاب */
export async function POST(req: Request, context: any) {
  const { botId } = context.params;
  const { id: userId } = await getPayload(req);

  await prisma.botLike.create({ data: { userId, botId } });
  await prisma.bot.update({
    where: { id: botId },
    data: { likesCount: { increment: 1 } },
  });

  return NextResponse.json({ liked: true });
}

/* DELETE = إلغاء الإعجاب */
export async function DELETE(req: Request, context: any) {
  const { botId } = context.params;
  const { id: userId } = await getPayload(req);

  await prisma.botLike.delete({
    where: { userId_botId: { userId, botId } },
  });
  await prisma.bot.update({
    where: { id: botId },
    data: { likesCount: { decrement: 1 } },
  });

  return NextResponse.json({ liked: false });
}
