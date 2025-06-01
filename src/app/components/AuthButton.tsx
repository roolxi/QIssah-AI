"use client";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function AuthButton() {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => router.push("/register")}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
      >
        <FaUserPlus />
        <span className="hidden sm:inline">انضم إلينا</span>
      </button>
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-2 border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all"
      >
        <FaSignInAlt />
        <span className="hidden sm:inline">تسجيل الدخول</span>
      </button>
    </div>
  );
}