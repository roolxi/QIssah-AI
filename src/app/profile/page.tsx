// src/app/profile/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [profile, setProfile] = useState({
    email: "",
    botName: "",
    bio: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("فشل جلب بيانات الحساب");
        const data = await res.json();
        setProfile({
          email: data.email || "",
          botName: data.botName || data.username || "",
          bio: data.bio || "",
        });
      } catch (e: any) {
        console.error(e);
        setError("حدث خطأ أثناء جلب بيانات الحساب");
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          botName: profile.botName,
          bio: profile.bio,
          ...(password && { password }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء التحديث");
      } else {
        setMessage("تم تحديث الحساب بنجاح");
      }
    } catch (e) {
      console.error(e);
      setError("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
      style={{ overflowY: "hidden" }}
    >
      {/* Header ثابت مع تمرير onMenuToggle */}
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode((m) => !m)}
        onMenuToggle={() => setMenuOpen((o) => !o)}
      />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* المحتوى */}
      <main className="pt-16 max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">البروفايل</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              الإيميل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1">
              كلمة المرور الجديدة (اختياري)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="botName" className="block mb-1">
              الاسم اللي يناديك فيه البوت
            </label>
            <input
              type="text"
              id="botName"
              name="botName"
              value={profile.botName}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1">
              نبذة عنك للبوت
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition"
          >
            {loading ? "جارٍ التحديث..." : "تحديث الحساب"}
          </button>
        </form>
      </main>
    </div>
  );
}
