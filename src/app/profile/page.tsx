"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    email: "",
    botName: "",
    bio: "",
  });
  const [password, setPassword] = useState(""); // كلمة مرور جديدة (اختياري)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // جلب بيانات الحساب الحالي من API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          throw new Error("فشل جلب بيانات الحساب");
        }
        const data = await res.json();
        setProfile({
          email: data.email || "",
          botName: data.botName || data.username || "",
          bio: data.bio || "",
        });
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب بيانات الحساب");
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          botName: profile.botName, // يتم تحديث حقل botName هنا فقط
          bio: profile.bio,
          ...(password && { password }), // إذا أدخلت كلمة مرور جديدة
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء التحديث");
      } else {
        setMessage("تم تحديث الحساب بنجاح");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)}  />
      <MobileMenu  menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">البروفايل</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">الإيميل</label>
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
            <label htmlFor="password" className="block mb-1">كلمة المرور الجديدة (اختياري)</label>
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
            <label htmlFor="botName" className="block mb-1">الاسم اللي يستخدمه البوت لمناداتك</label>
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
            <label htmlFor="bio" className="block mb-1">معلومات إضافية للبوت (مثلاً وصف مختصر)</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
          >
            {loading ? "جارٍ التحديث..." : "تحديث الحساب"}
          </button>
        </form>
      </main>
    </div>
  );
}
