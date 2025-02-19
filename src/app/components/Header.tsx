"use client";
import { FaMoon, FaBars } from "react-icons/fa";
import AuthButton from "./AuthButton";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ darkMode, toggleTheme, setMenuOpen }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white">
      <div className="text-xl font-bold">Qissah AI</div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-xl">
          <FaMoon />
        </button>
        <AuthButton />
        <button onClick={() => setMenuOpen(prev => !prev)} className="text-xl">
          <FaBars />
        </button>
      </div>
    </header>
  );
}
