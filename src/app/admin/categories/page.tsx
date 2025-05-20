// src/app/admin/bots/page.tsx
import { prisma } from '@/lib/prisma';

export default async function AdminBotsPage() {
  const bots = await prisma.bot.findMany({
    include: { creator: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bots</h1>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Creator</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.creator?.username ?? '-'}</td>
              <td>{b.likesCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
