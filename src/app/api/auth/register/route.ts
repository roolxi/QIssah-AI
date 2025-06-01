import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET!;
if (!SECRET_KEY) throw new Error('JWT_SECRET missing');

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  if (!username || !email || !password)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'Email already used' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { username, email, password: hashed, role: 'USER', blocked: false },
  });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, blocked: false },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({ message: 'Registered', user: { ...newUser, password: undefined } });
  res.headers.set(
    'Set-Cookie',
    `token=${token}; Path=/; Max-Age=604800; Secure; SameSite=None; HttpOnly`
  );
  return res;
}
