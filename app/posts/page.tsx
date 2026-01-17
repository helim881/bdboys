"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data?.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#003366] mb-2" size={32} />
        <p className="text-gray-500">পোস্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="border-b-2 border-[#003366] mb-8 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">সর্বশেষ আপডেট</h1>
          <p className="text-gray-500 mt-1">
            সবচেয়ে সাম্প্রতিক প্রকাশিত খবর ও পোস্টসমূহ
          </p>
        </div>
        <div className="text-sm font-bold text-gray-400">
          মোট পোস্ট: {posts.length}
        </div>
      </div>

      {/* Posts Grid */}
      {/* Posts Grid */}
      {/* Posts Grid */}
      <div className=" ">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="flex p-4 gap-4 hover:bg-blue-50/30 transition-colors group cursor-pointer border border-transparent hover:border-blue-100 rounded"
            >
              {/* Image Box */}
              <div className="w-24 h-24 bg-gray-200 flex-shrink-0 border border-gray-300 rounded overflow-hidden relative">
                <img
                  src={post.image || "/placeholder.jpg"}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Post Content */}
              <div className="flex flex-col justify-center">
                <Link
                  href={`/posts/${post?.slug}`}
                  className="text-[#0056b3] font-bold text-base group-hover:underline"
                >
                  {post.title}
                </Link>

                <p className="text-gray-500 text-sm line-clamp-1 mt-1">
                  {post.excerpt || "বিস্তারিত পড়তে ক্লিক করুন..."}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2 font-medium">
                  {/* FIX: Access .name if author is an object */}
                  <span>
                    👤{" "}
                    {typeof post.author === "object"
                      ? post.author?.name
                      : post.author}
                  </span>

                  {/* FIX: Handle Date objects or strings */}
                  <span>
                    📅{" "}
                    {new Date(post.createdAt || post.date).toLocaleDateString(
                      "bn-BD"
                    )}
                  </span>

                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[#003366]">
                    ❤️ {post.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            কোন পোস্ট পাওয়া যায়নি।
          </div>
        )}
      </div>
    </main>
  );
}
