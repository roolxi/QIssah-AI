import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPayload } from '@/lib/getPayload';

/** PATCH /api/admin/users/[userId]/block */
export async function PATCH(
  req: Request,
  context: any               // ← أبسط: اجعلها any أو احذف النوع
) {
  const { userId } = context.params;

  const payload = await getPayload(req);
  if (payload.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.user.update({
    where: { id: userId },
    data: { blocked: true },
  });

  return NextResponse.json({ ok: true });
}
