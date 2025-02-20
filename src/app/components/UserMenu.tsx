"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // مثال: جلب اسم المستخدم من الكوكيز
    const match = document.cookie.match('(^|;)\\s*username\\s*=\\s*([^;]+)');
    if (match && match.pop()) {
      setUsername(match.pop()!);
    } else {
      setUsername("User");
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // مسح التوكن واسم المستخدم من الكوكيز
    document.cookie = "token=; Path=/; Max-Age=0";
    document.cookie = "username=; Path=/; Max-Age=0";
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        <span className="hidden sm:inline">{username}</span>
        <FaChevronDown />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            <li>
              <Link href="/profile">
                <a className="block px-4 py-2 hover:bg-gray-200">Profile</a>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <a className="block px-4 py-2 hover:bg-gray-200">Settings</a>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
