import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPayload } from '@/lib/getPayload';

/** PATCH /api/admin/users/[userId]/block */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const payload = await getPayload(_req);
  if (payload.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.user.update({
    where: { id: params.userId },
    data: { blocked: true },
  });

  return NextResponse.json({ ok: true });
}
