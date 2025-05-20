import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET!;
if (!SECRET_KEY) throw new Error('JWT_SECRET missing');

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const token = cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1];

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (payload.blocked)
    return NextResponse.json({ error: 'Account blocked' }, { status: 403 });

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { password, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
