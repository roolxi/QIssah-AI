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
    // Retrieve and decode the username cookie
    const match = document.cookie.match(/(?:^|;\s*)username=([^;]+)/);
    if (match && match[1]) {
      setUsername(decodeURIComponent(match[1]));
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
    // Remove cookies for token and username
    document.cookie = "token=; Path=/; Max-Age=0";
    document.cookie = "username=; Path=/; Max-Age=0";
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {/* On small screens, show only the profile icon */}
        <span className="hidden sm:inline text-current">{username}</span>
        <FaUserCircle className="text-current" size={24} />
        <FaChevronDown className="hidden sm:inline text-current" size={12} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-transparent text-gray-900 dark:text-gray-100">
          <ul className="py-2">
            <li>
              <Link href="/profile">
                <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Profile</a>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Settings</a>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
