// src/app/create-bot/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

type Category = { id: string; name: string };

export default function CreateBotPage() {
  const router = useRouter();

  // حالات النموذج
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    personality: "",
    accent: "",
    categoryId: "",
    isPublic: true,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ثيم وقائمة الموبايل
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // جلب التصنيفات
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "فشل الإنشاء");
      }
      const { id } = await res.json();
      router.push(`/chat/${id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 to-indigo-900 text-white"
      style={{ overflowY: "hidden" }}
    >
      {/* Header و MobileMenu */}
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode((m) => !m)}
        onMenuToggle={() => setMenuOpen((o) => !o)}
      />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* المحتوى */}
      <main className="flex-1 flex items-center justify-center p-4 pt-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-black/40 backdrop-blur-sm p-8 rounded-xl shadow-xl space-y-6"
        >
          <h1 className="text-3xl font-bold text-center">إنشاء بوت جديد</h1>
          {error && <p className="text-red-400 text-center">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="اسم البوت"
              className="p-3 rounded bg-white/10 placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="p-3 rounded bg-white/10 placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">اختر التصنيف</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
            placeholder="وصف مختصر"
            className="w-full p-3 rounded bg-white/10 placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="رابط صورة (اختياري)"
              className="p-3 rounded bg-white/10 placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              name="accent"
              value={formData.accent}
              onChange={handleChange}
              placeholder="اللهجة (اختياري)"
              className="p-3 rounded bg-white/10 placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <textarea
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            rows={2}
            placeholder="الشخصية (اختياري)"
            className="w-full p-3 rounded bg-white/10 placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-5 w-5 rounded bg-white/10 checked:bg-purple-500"
            />
            جعل البوت عامًا
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء البوت"}
          </button>
        </form>
      </main>
    </div>
  );
}
