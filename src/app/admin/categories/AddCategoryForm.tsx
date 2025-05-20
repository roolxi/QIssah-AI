'use client';
import { useState, useTransition } from 'react';

export default function AddCategoryForm() {
  const [name, setName] = useState('');
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    start(async () => {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      location.reload();
    });
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم التصنيف"
        className="border p-2 rounded w-56"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white rounded px-4"
      >
        إضافة
      </button>
    </form>
  );
}
