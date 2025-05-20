// شاشة أساس لوحة التحكّم (Server Component)
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'لوحة التحكم',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* الشريط الجانبي */}
      <aside className="w-60 bg-[#212121] text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>

        <nav className="space-y-3">
          <Link href="/admin" className="block hover:text-blue-400">
            الرئيسية
          </Link>
          <Link href="/admin/users" className="block hover:text-blue-400">
            المستخدمون
          </Link>
          <Link href="/admin/bots" className="block hover:text-blue-400">
            البوتات
          </Link>
          <Link href="/admin/categories" className="block hover:text-blue-400">
            التصنيفات
          </Link>
        </nav>
      </aside>

      {/* مساحة المحتوى */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
