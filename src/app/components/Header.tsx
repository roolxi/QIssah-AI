"use client";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // نستخدمه لجعل الصورة قابلة للضغط

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ darkMode, toggleTheme, setMenuOpen }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // فحص وجود التوكن في الكوكيز
    setIsLoggedIn(document.cookie.includes("token="));
  }, []);

  return (
    <header
      className={`flex justify-between items-center px-6 py-3 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* نلف الصورة بـ Link لجعلها قابلة للضغط */}
      <Link href="/">
        {/* Image من Next.js مع عرض/ارتفاع أكبر، مثلاً 80x80 */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="cursor-pointer"
          priority
        />
      </Link>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-xl">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        {isLoggedIn ? <UserMenu /> : <AuthButton />}
        <button onClick={() => setMenuOpen((prev) => !prev)} className="text-xl">
          <FaBars />
        </button>
      </div>
    </header>
  );
}
