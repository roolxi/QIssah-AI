"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBotPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    personality: "",
    accent: "",
    isPublic: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    const fieldValue = target.type === "checkbox" ? target.checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create bot");
      }
      const data = await response.json();
      router.push(`/chat/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Create a New Bot</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">
            Bot Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="personality" className="block mb-1">
            Personality (optional)
          </label>
          <textarea
            id="personality"
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="accent" className="block mb-1">
            Accent (optional)
          </label>
          <input
            type="text"
            id="accent"
            name="accent"
            value={formData.accent}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isPublic">Make Bot Public</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
        >
          {loading ? "Creating..." : "Create Bot"}
        </button>
      </form>
    </div>
  );
}
