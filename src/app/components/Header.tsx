"use client";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

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
      {/* استبدل النص بالصورة: تأكد إن الصورة موجودة في مجلد public (مثلاً public/logo.png) */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>
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
