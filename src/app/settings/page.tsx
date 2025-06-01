// src/app/settings/page.tsx
"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-purple-700 to-indigo-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
      style={{ overflowY: "hidden" }}
    >
      {/* الهيدر الثابت */}
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode((m) => !m)}
        onMenuToggle={() => setMenuOpen((o) => !o)}
      />
      {/* القائمة الجانبية في الموبايل */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* المحتوى بعد تعويض مساحة الهيدر */}
      <main className="pt-16 max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">الإعدادات</h1>
        <p>خصص تجربتك هنا.</p>
      </main>
    </div>
  );
}
