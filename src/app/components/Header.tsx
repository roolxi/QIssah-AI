"use client";
import { FaMoon, FaSun } from "react-icons/fa";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";
import DropdownMenu from "./DropdownMenu"; // New component
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ darkMode, toggleTheme, setMenuOpen }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("token="));
  }, []);

  return (
    <header
      className={`flex items-center justify-between h-16 px-4 bg-gradient-to-br from-[#D8BFD8] to-[#4B0082] text-white`}
      style={{ minHeight: "4rem" }}
    >
      {/* New Text-based Logo */}
      <Link href="/" className="flex items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold uppercase">QISSAAH.AI</h1>
      </Link>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-xl">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        {isLoggedIn ? <UserMenu /> : <AuthButton />}
        <DropdownMenu />
      </div>
    </header>
  );
}