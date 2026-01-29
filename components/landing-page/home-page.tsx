"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import RecentPost from "../recentpost";
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
          {categories.map((category: any) => (
            <CategoryWithPost key={category.id} category={category} />
          ))}

          {/* আধুনিক পেজিনেশন কন্ট্রোল */}
          <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              মোট ক্যাটাগরি: <span className="text-blue-600">{meta.total}</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="bg-blue-50 text-blue-700 h-10 px-5 flex items-center justify-center rounded-xl font-black text-sm">
                পেজ {page} / {meta.totalPage}
              </div>

              <button
                disabled={page >= meta.totalPage}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <RecentPost />
    </main>
  );
}
