"use client";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import AuthButton from "@/app/components/AuthButton";
import UserMenu from "@/app/components/UserMenu";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
      <div className="text-xl font-bold">Qissah AI</div>
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
