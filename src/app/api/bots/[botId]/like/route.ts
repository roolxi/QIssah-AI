import { prisma } from '@/lib/prisma';
import { getPayload } from '@/lib/getPayload';
import { NextResponse } from 'next/server';

type Params = { params: { botId: string } };

/* إضافة إعجاب */
export async function POST(req: Request, { params }: Params) {
  try {
    const payload = await getPayload(req);

    await prisma.botLike.create({
      data: { userId: payload.id, botId: params.botId },
    });

    await prisma.bot.update({
      where: { id: params.botId },
      data: { likesCount: { increment: 1 } },
    });

    return NextResponse.json({ liked: true });
  } catch (e) {
    return NextResponse.json({ error: 'Could not like' }, { status: 400 });
  }
}

/* إلغاء الإعجاب */
export async function DELETE(req: Request, { params }: Params) {
  try {
    const payload = await getPayload(req);

    await prisma.botLike.delete({
      where: { userId_botId: { userId: payload.id, botId: params.botId } },
    });

    await prisma.bot.update({
      where: { id: params.botId },
      data: { likesCount: { decrement: 1 } },
    });

    return NextResponse.json({ liked: false });
  } catch {
    return NextResponse.json({ error: 'Could not unlike' }, { status: 400 });
  }
}
