"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileEdit,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Added basic interface to prevent object-rendering errors
interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  status: string;
  category: { name: string; slug: string }; // Matches your error: {name, slug}
  author: { name: string; image?: string };
}

const ManagePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]); // Typed as Post[]
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("সব স্ট্যাটাস");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, status, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        search,
        status: status === "সব স্ট্যাটাস" ? "" : status,
        limit: "10",
      });
      const res = await fetch(`/api/posts?${query}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setMeta(data.meta || { total: 0, page: 1, lastPage: 1 });
    } catch (err) {
      toast.error("পোস্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছতে চান?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("পোস্ট মুছে ফেলা হয়েছে");
        fetchPosts();
      }
    } catch (err) {
      toast.error("মুছে ফেলা সম্ভব হয়নি");
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900">পোস্ট লিস্ট</h3>
          <p className="text-xs text-slate-500 font-medium">
            মোট {meta.total} টি কন্টেন্ট পাওয়া গেছে
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none cursor-pointer"
          >
            <option>সব স্ট্যাটাস</option>
            <option value="published">প্রকাশিত</option>
            <option value="pending">পেন্ডিং</option>
            <option value="draft">ড্রাফ্ট</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="animate-spin text-red-600 w-8 h-8" />
          </div>
        )}

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
            <tr>
              <th className="px-6 py-4">পোস্ট ও লেখক</th>
              <th className="px-6 py-4 text-center">ক্যাটেগরি</th>
              <th className="px-6 py-4 text-center">স্ট্যাটাস</th>
              <th className="px-6 py-4 text-right">একশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="max-w-[300px]">
                    <p className="font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-1">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">
                        👤 {post.author?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase tracking-tight">
                    {/* FIXED: Rendering post.category.name instead of object */}
                    {post.category?.name || "No Category"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter ${
                      post.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/posts/${post.slug}`}
                      target="_blank"
                      className="p-2 hover:bg-white hover:shadow-sm text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="p-2 hover:bg-white hover:shadow-sm text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
                    >
                      <FileEdit size={16} />
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 hover:bg-white hover:shadow-sm text-slate-400 hover:text-red-600 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-slate-50 flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          পৃষ্ঠা <span className="text-slate-900">{meta.page}</span> /{" "}
          {meta.lastPage}
        </p>
        <div className="flex gap-2">
          <button
            disabled={meta.page === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <button
            disabled={meta.page === meta.lastPage}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePosts;
