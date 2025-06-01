import { prisma } from '@/lib/prisma';
import AddCategoryForm from './AddCategoryForm';

export const metadata = { title: 'التصنيفات' };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { bots: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">التصنيفات</h1>

      {/* جدول التصنيفات */}
      <table className="w-full text-sm bg-white shadow-md rounded">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-2 text-start">الاسم</th>
            <th className="p-2 text-center">عدد البوتات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b last:border-none">
              <td className="p-2">{c.name}</td>
              <td className="p-2 text-center">{c._count.bots}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* نموذج إضافة تصنيف */}
      <AddCategoryForm />
    </div>
  );
}
