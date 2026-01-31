"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryWithPost from "./categoryWithPost";

export default function PostPortal() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPage: 1, total: 0 });

  const fetchCategories = async (currentPage: number) => {
    setLoading(true);
    try {
      // আমরা আগে যে এপিআই রুটটি বানিয়েছিলাম সেটি কল করছি
      const res = await fetch(
        `/api/categories/post?page=${currentPage}&limit=5`,
      );
      const result = await res.json();

      if (result.success) {
        setCategories(result.data);
        setMeta(result.meta);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  return (
    <main className="py-6 space-y-12 min-h-[400px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
          <p className="text-slate-500 font-bold animate-pulse">
            কন্টেন্ট লোড হচ্ছে...
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {categories.map((category: any, index) => (
            <CategoryWithPost
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      )}
    </main>
  );
}
