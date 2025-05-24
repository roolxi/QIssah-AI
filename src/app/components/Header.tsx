// src/app/components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onMenuToggle: () => void;
}

export default function Header({
  darkMode,
  toggleTheme,
  onMenuToggle,
}: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // detect if user has a token cookie
    setIsLoggedIn(document.cookie.includes("token="));
  }, []);

  return (
    <header className="
      fixed inset-x-0 top-0 z-50
      backdrop-blur-lg bg-gradient-to-br from-indigo-900/60 via-purple-700/60 to-indigo-900/60
      border-b border-white/10
      shadow-md
      transition-colors duration-500
    ">
      <div className="max-w-7xl mx-auto flex items-center px-6 py-3">
        {/* mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-2xl p-2 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Toggle menu"
        >
          <FaBars className="text-white" />
        </button>

        {/* logo */}
        <Link
          href="/"
          className="ml-4 md:ml-0 text-3xl font-extrabold uppercase tracking-widest text-white hover:text-indigo-200 transition-colors"
        >
          QISSAAH.<span className="text-cyan-400">AI</span>
        </Link>

        {/* spacer */}
        <div className="flex-1" />

        {/* actions */}
        <div className="flex items-center space-x-4">
          {/* theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-yellow-300" />
            ) : (
              <FaMoon className="text-gray-200" />
            )}
          </button>

          {/* auth vs user menu */}
          {isLoggedIn ? <UserMenu /> : <AuthButton />}
        </div>
      </div>
    </header>
  );
}
