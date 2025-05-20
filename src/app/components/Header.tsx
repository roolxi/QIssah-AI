"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onMenuToggle: () => void;    // ضفنا toggle للـ MobileMenu
}

export default function Header({
  darkMode,
  toggleTheme,
  onMenuToggle,
}: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("token="));
  }, []);

  return (
    <header
      className="
        fixed top-0 inset-x-0 z-50 flex items-center justify-between
        px-6 py-3
        backdrop-blur-md bg-gradient-to-br from-purple-700/60 to-indigo-900/60
        text-white
      "
    >
      {/* زر القائمة للهواتف */}
      <button
        onClick={onMenuToggle}
        className="md:hidden text-xl p-2 rounded hover:bg-white/20 transition"
      >
        <FaBars />
      </button>

      {/* شعار الموقع */}
      <Link href="/" className="text-2xl font-bold uppercase tracking-wide">
        QISSAAH.AI
      </Link>

      {/* مساحات فارغة حتى يدور الـ flex بشكل سليم */}
      <div className="flex-1" />

      {/* الأزرار الجانبية */}
      <div className="flex items-center gap-4">
        {/* تبديل الثيم */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/20 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* زر تسجيل/حساب مستخدم */}
        {isLoggedIn ? <UserMenu /> : <AuthButton />}
      </div>
    </header>
  );
}
