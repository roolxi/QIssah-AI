"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

type Category = { id: string; name: string };

export default function CreateBotPage() {
  const router = useRouter();

  /* نموذج البيانات */
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    personality: "",
    accent: "",
    categoryId: "",
    isPublic: true,
  });

  /* حالة المكوّن */
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /* جلب التصنيفات */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    })();
  }, []);

  /* تغيّر الحقول */
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* إرسال النموذج */
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
        const data = await res.json();
        throw new Error(data.error || "Failed to create bot");
      }
      const data = await res.json();
      router.push(`/chat/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#5f35aa] to-[#212121] text-white"
      style={{ overflowY: "hidden" }}
    >
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-[#1e1e1e] p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">إنشاء بوت جديد</h1>

          {error && <p className="mb-4 text-red-400 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="اسم البوت"
              className="w-full p-2 rounded bg-[#2c2c2c]"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="وصف مختصر"
              rows={3}
              className="w-full p-2 rounded bg-[#2c2c2c]"
            />

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="رابط صورة (اختياري)"
              className="w-full p-2 rounded bg-[#2c2c2c]"
            />

            <textarea
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              placeholder="الشخصية (اختياري)"
              rows={2}
              className="w-full p-2 rounded bg-[#2c2c2c]"
            />

            <input
              name="accent"
              value={formData.accent}
              onChange={handleChange}
              placeholder="اللهجة (اختياري)"
              className="w-full p-2 rounded bg-[#2c2c2c]"
            />

            {/* اختيار التصنيف */}
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-[#2c2c2c]"
            >
              <option value="">اختر التصنيف</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* جعل البوت عامًا */}
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              جعل البوت عامًا
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              {loading ? "يتم الإنشاء..." : "إنشاء البوت"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
