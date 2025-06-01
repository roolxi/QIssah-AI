import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: Request) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith('/admin')) return NextResponse.next();

  const token = req.headers.get('cookie')?.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
  if (!token) return NextResponse.redirect(new URL('/', req.url));

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.blocked || payload.role !== 'ADMIN')
      return NextResponse.redirect(new URL('/', req.url));

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = { matcher: ['/admin/:path*'] };
