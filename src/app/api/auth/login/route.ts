import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET!;
if (!SECRET_KEY) throw new Error('JWT_SECRET missing');

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  if (user.blocked)
    return NextResponse.json({ error: 'Account blocked' }, { status: 403 });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, blocked: user.blocked },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({ message: 'Login successful', user: { ...user, password: undefined } });
  res.headers.set(
    'Set-Cookie',
    `token=${token}; Path=/; Max-Age=604800; Secure; SameSite=None; HttpOnly`
  );
  return res;
}
