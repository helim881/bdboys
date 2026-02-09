"use client";

import PostCard from "@/components/landing-page/post-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, StickyNote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function SingleUserPostsTab({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, totalItems: 0 });

  // ফেচ ফাংশনটি useCallback দিয়ে র‍্যাপ করা ভালো যাতে অপ্রয়োজনীয় রেন্ডার না হয়
  const fetchPosts = useCallback(
    async (pageNum: number) => {
      if (!userId) return;

      setLoading(true);
      try {
        // API কলে userId পাঠানো নিশ্চিত করা হয়েছে
        const res = await fetch(
          `/api/users/post?userId=${userId}&page=${pageNum}`,
        );
        const result = await res.json();

        if (result.success) {
          setPosts(result.data);
          setMeta({
            totalPages: result.meta.totalPages,
            totalItems: result.meta.totalItems,
          });
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // ট্যাব কন্টেন্টের শুরুতে স্ক্রল করার জন্য
    const element = document.getElementById("posts-tab-top");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full py-4 min-h-[400px]">
      <div id="posts-tab-top" /> {/* Scroll anchor */}
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[13px] font-bold text-[#003366] uppercase flex items-center gap-2">
          <StickyNote size={14} /> User Timeline
        </h3>
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
          Total Posts: {meta.totalItems}
        </span>
      </div>
      {/* Posts List Area */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-[11px] text-gray-500">ফেচ করা হচ্ছে...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3 animate-in fade-in duration-500">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 border border-dashed rounded-lg">
            <p className="text-[12px] text-gray-400">
              এখনো কোনো পোস্ট পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
      {/* Simple Pagination for Tabs */}
      {!loading && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="h-8 text-[11px] font-bold"
          >
            <ChevronLeft size={14} className="mr-1" /> Prev
          </Button>

          <span className="text-[11px] font-bold text-gray-600">
            {page} / {meta.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === meta.totalPages}
            className="h-8 text-[11px] font-bold"
          >
            Next <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
