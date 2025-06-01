"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({ menuOpen, setMenuOpen }: MobileMenuProps) {
  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/catalog", label: "الأقسام" },
    { href: "/create-bot", label: "اصنع بوتك" },
    { href: "/help", label: "المساعدة" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <motion.nav
      initial={{ x: "100%" }}
      animate={{ x: menuOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="
        fixed top-0 right-0 h-full w-64
        backdrop-blur-lg bg-gradient-to-br from-purple-700/40 to-indigo-900/40
        text-white p-6 flex flex-col
        shadow-2xl
      "
    >
      {/* زر إغلاق */}
      <button
        className="self-end mb-6 p-2 rounded hover:bg-white/20 transition"
        onClick={() => setMenuOpen(false)}
      >
        ✕
      </button>

      {/* روابط القائمة */}
      <ul className="flex-1 space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="
                block text-lg font-medium
                px-3 py-2 rounded
                hover:bg-white/20 transition
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* أسفل القائمة */}
      <div className="mt-auto pt-4 border-t border-white/20 space-y-3">
        <Link
          href="/settings"
          onClick={() => setMenuOpen(false)}
          className="block text-lg hover:text-purple-300 transition"
        >
          الإعدادات
        </Link>
      </div>
    </motion.nav>
  );
}
