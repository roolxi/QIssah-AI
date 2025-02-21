"use client";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      className={`flex items-center justify-between h-16 px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
      style={{ minHeight: "4rem" }}
    >
      {/* الشعار مع تكبير الحجم */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          // يمكنك تغيير هذه الأرقام لتكبير/تصغير الشعار
          width={64}
          height={64}
          priority
          className="cursor-pointer object-contain w-16 h-16"
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
