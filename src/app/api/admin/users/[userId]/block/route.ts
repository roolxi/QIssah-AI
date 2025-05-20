import { prisma } from '@/lib/prisma';
import { getPayload } from '@/lib/getPayload';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const payload = await getPayload(req);
    if (payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.user.update({
      where: { id: params.userId },
      data: { blocked: true },
    });

    return NextResponse.json({ ok: true });
  } catch /* istanbul ignore next */ 
  (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
