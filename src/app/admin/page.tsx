// Server Component
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  // استعلامات متوازية
  const [users, bots, categories, likes] = await Promise.all([
    prisma.user.count(),
    prisma.bot.count(),
    prisma.category.count(),
    prisma.botLike.count(),
  ]);

  const cards = [
    { title: 'المستخدمون', count: users, color: 'bg-blue-600' },
    { title: 'البوتات', count: bots, color: 'bg-green-600' },
    { title: 'التصنيفات', count: categories, color: 'bg-yellow-500' },
    { title: 'الإعجابات', count: likes, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الرئيسية</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`${c.color} text-white rounded-lg p-5 shadow-lg`}
          >
            <h3 className="text-lg mb-2">{c.title}</h3>
            <p className="text-3xl font-bold">{c.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
