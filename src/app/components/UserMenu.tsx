"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)username=([^;]+)/);
    setUsername(match && match[1] ? decodeURIComponent(match[1]) : "User");
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
    document.cookie = "token=; Path=/; Domain=qissah-ai.vercel.app; Max-Age=0; SameSite=None; Secure";
    document.cookie = "username=; Path=/; Domain=qissah-ai.vercel.app; Max-Age=0; SameSite=None; Secure";
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded transition-all hover:bg-gray-200/30"
      >
        <span className="hidden sm:inline text-white">{username}</span>
        <FaUserCircle className="text-white" size={24} />
        <FaChevronDown className="hidden sm:inline text-white" size={12} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-[#212121] text-white rounded-lg shadow-lg z-10">
          <ul className="py-2">
            <li>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-600">
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-600">
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}