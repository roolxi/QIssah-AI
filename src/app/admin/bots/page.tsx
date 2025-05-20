// Server Component
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = { title: 'بوتات الموقع' };

export default async function AdminBotsPage() {
  const bots = await prisma.bot.findMany({
    include: { creator: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">البوتات</h1>

      <table className="w-full text-sm bg-white shadow-md rounded">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-2 text-start">الاسم</th>
            <th className="p-2 text-start">المنشئ</th>
            <th className="p-2 text-center">الإعجابات</th>
            <th className="p-2 text-center">عام؟</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((b) => (
            <tr key={b.id} className="border-b last:border-none">
              <td className="p-2">
                <Link href={`/chat/${b.id}`} className="text-blue-600 hover:underline">
                  {b.name}
                </Link>
              </td>
              <td className="p-2">{b.creator?.username ?? '-'}</td>
              <td className="p-2 text-center">{b.likesCount}</td>
              <td className="p-2 text-center">{b.isPublic ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
