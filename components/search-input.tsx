"use client";

import { Search, X } from "lucide-react"; // X আইকন যোগ করা হয়েছে
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery(""); // ইনপুট খালি করবে
    router.push("/"); // মেইন পেজে পাঠিয়ে দিবে যাতে সব কন্টেন্ট আবার ফিরে আসে
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="এখানে খুঁজুন..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full py-3 px-6 pr-24 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-gray-700"
      />

      {/* Remove (X) Button - শুধু তখনই দেখাবে যখন ইনপুট এ কিছু থাকবে */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-20 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      )}

      {/* Search Button */}
      <button
        type="submit"
        className="absolute right-1 top-1 bottom-1 px-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:opacity-90 transition-opacity flex items-center justify-center"
      >
        <Search size={20} strokeWidth={2.5} />
      </button>
    </form>
  );
}
