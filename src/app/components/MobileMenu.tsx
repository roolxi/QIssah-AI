"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  darkMode: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({ darkMode, menuOpen, setMenuOpen }: MobileMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    setIsLoggedIn(hasToken);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 w-64 h-full p-6 flex flex-col bg-gradient-to-br from-[#D8BFD8] to-[#4B0082] text-white shadow-2xl ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <button className="self-end mb-4" onClick={() => setMenuOpen(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <Link
        href="/"
        onClick={() => setMenuOpen(false)}
        className="mb-3 text-lg hover:text-red-400"
      >
        الرئيسية
      </Link>

      <Link
        href="/catalog"
        onClick={() => setMenuOpen(false)}
        className="mb-3 text-lg hover:text-red-400"
      >
        الأقسام (الكتالوج)
      </Link>

      {isLoggedIn && (
        <Link
          href="/create-bot"
          onClick={() => setMenuOpen(false)}
          className="mb-3 text-lg hover:text-red-400"
        >
          اصنع البوت الخاص فيك !
        </Link>
      )}

      <div className="mt-auto pt-4 border-t border-gray-400">
        <Link
          href="/help"
          onClick={() => setMenuOpen(false)}
          className="block text-lg mt-3 hover:text-red-400"
        >
          المساعدة
        </Link>
        <Link
          href="/contact"
          onClick={() => setMenuOpen(false)}
          className="block text-lg mt-3 hover:text-red-400"
        >
          تواصل معنا
        </Link>
      </div>
    </nav>
  );
}