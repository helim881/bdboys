"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import PostCard from "./landing-page/post-card";

export default function RecentPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch("/api/posts?limit=5");
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch recent posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8 border border-[#B8D1E5] bg-white">
        <Loader2 className="animate-spin text-[#003366]" size={24} />
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden">
      <div className="bg-[#003366] px-4 py-2">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider">
          সাম্প্রতিক পোস্ট (Recent Posts)
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {posts &&
          posts?.length > 0 &&
          posts?.map((post: any) => (
            <PostCard key={post.id} post={post} list />
          ))}
      </div>
    </section>
  );
}
