// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaMagic,
  FaGoogle,
  FaApple,
  FaSpinner,
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  /* ------- state ------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // لو تريد magic-link فقط احذف هذا
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false); // رسالة magic-link

  /* ------- handlers ------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("أدخل بريدك الإلكتروني");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "خطأ في تسجيل الدخول");

      // ✅ لو عندك JWT من الـ API
      if (data.token)
        document.cookie = `token=${data.token}; Path=/; Max-Age=604800; Secure; SameSite=None`;

      if (data.user?.username)
        document.cookie = `username=${encodeURIComponent(
          data.user.username,
        )}; Path=/; Max-Age=604800; Secure; SameSite=None`;

      /* لو API يرسل magic link فقط */
      if (data.magicLink === true) {
        setMagicSent(true);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------- JSX ------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5e2ea3] to-black text-white px-4">
      {/* زر رجوع */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 text-white hover:text-blue-300"
      >
        <FaArrowLeft size={22} />
      </button>

      {/* صندوق تسجيل الدخول */}
      <div className="w-full max-w-md rounded-[30px] bg-white/10 backdrop-blur-md p-8 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition">
        {/* لوجو */}
        <div className="flex items-center justify-center gap-2 text-2xl font-extrabold mb-8">
          <span className="text-[#00b3ff] drop-shadow-[0_0_6px_rgba(0,179,255,0.6)]">
            QISSAH
          </span>
          .AI <FaMagic className="text-blue-400" />
        </div>

        {/* عنوان + وصف */}
        <h2 className="text-lg font-bold mb-1 text-left">SIGN&nbsp;IN</h2>
        <p className="text-sm text-white/80 font-semibold leading-5 mb-6 text-left">
          ENTER YOUR EMAIL<br />
          AND WE&apos;LL SEND A&nbsp;CODE TO YOUR INBOX<br />
          NO NEED FOR PASSWORDS — LIKE&nbsp;MAGIC
        </p>

        {/* رسالة link-sent */}
        {magicSent && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-blue-400/30 bg-blue-400/10 text-center animate-fade-in">
            <FaMagic className="mx-auto mb-2 text-blue-400 text-2xl" />
            <p className="text-sm">Magic link sent! Check your email.</p>
          </div>
        )}

        {/* نموذج */}
        {!magicSent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-semibold">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00b3ff]"
              />
            </div>

            {/* إزالة حقل كلمة المرور لو ما تحتاجه */}
            <div className="hidden">
              <label className="block mb-1 text-sm font-semibold">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-3 placeholder-white/50"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-semibold">{error}</p>
            )}

            {/* زر المتابعة */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-[#0094ff] to-[#00b3ff] py-3 font-bold tracking-wide hover:-translate-y-0.5 transition focus:outline-none"
            >
              {loading ? (
                <FaSpinner className="mx-auto animate-spin" />
              ) : (
                "CONTINUE"
              )}
            </button>
          </form>
        )}

        {/* فاصل */}
        {!magicSent && (
          <>
            <div className="flex items-center my-6 text-white/60 text-sm font-semibold">
              <span className="flex-1 border-t border-white/20" />
              <span className="px-3">OR CONTINUE WITH</span>
              <span className="flex-1 border-t border-white/20" />
            </div>

            {/* أزرار OAuth (واجهة فقط) */}
            <button
              onClick={() => alert("Redirecting to Google (demo)")}
              className="w-full flex items-center justify-center gap-2 bg-black/30 border border-white/20 px-4 py-3 rounded-lg mb-3 hover:bg-black/40 transition"
            >
              <FaGoogle className="text-[#4285F4]" />
              Continue with Google
            </button>

            <button
              onClick={() => alert("Redirecting to Apple (demo)")}
              className="w-full flex items-center justify-center gap-2 bg-black/30 border border-white/20 px-4 py-3 rounded-lg hover:bg-black/40 transition"
            >
              <FaApple />
              Continue with Apple
            </button>
          </>
        )}

        {/* رابط التسجيل تحت */}
        {!magicSent && (
          <p className="text-xs mt-5 text-center text-white/70">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

/* ---- tailwind animate helper (يمكن إضافته في globals.css إن أردت) ---- */
/* .animate-fade-in { @apply animate-[fadeIn_0.5s_ease]; } */
