import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function getPayload(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const token = cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
  if (!token) throw new Error('No token');

  try {
    return jwt.verify(token, SECRET) as {
      id: string;
      role: string;
      blocked: boolean;
    };
  } catch {
    throw new Error('Invalid token');
  }
}
