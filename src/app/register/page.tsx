"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    // تأكد إن data.token موجود
    if (data.token) {
      document.cookie = `token=${data.token}; Path=/; Max-Age=604800; Secure; SameSite=None; Domain=qissah-ai.vercel.app`;
    }
    // لو عندك username من الـ API
    if (data.user?.username) {
      document.cookie = `username=${encodeURIComponent(data.user.username)}; Path=/; Max-Age=604800; Secure; SameSite=None; Domain=qissah-ai.vercel.app`;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 bg-gray-700 rounded-md border border-gray-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 bg-gray-700 rounded-md border border-gray-600"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 bg-gray-700 rounded-md border border-gray-600"
        />
        <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
