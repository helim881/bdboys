"use client";

import RecentPost from "@/components/recentpost";
import { Calendar, Eye, Heart } from "lucide-react";
import { useState } from "react";

const PostClientView = ({ post }: { post: any }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // You can call a server action here to update the DB like count
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          {/* Featured Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={post.image || "https://via.placeholder.com/1200x600"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-sm font-semibold text-gray-800 rounded-full">
                  {post.category?.name}
                </span>
                {post.subCategory && (
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-sm font-semibold text-gray-800 rounded-full">
                    {post.subCategory.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Post Meta */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-[#003366] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {post.author?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {post.author?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    প্রযুক্তি গবেষক ও লেখক
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("bn-BD")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} ভিউ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div
            className="p-8 prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-[#003366]"
            dangerouslySetInnerHTML={{
              __html: post.contentHtml || post.content,
            }}
          />

          {/* Post Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
                isLiked
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-red-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-bold">
                {isLiked ? "লাইক দেওয়া হয়েছে" : "লাইক দিন"}
              </span>
              <span className="ml-2 opacity-80">
                {post.likeCount + (isLiked ? 1 : 0)}
              </span>
            </button>
          </div>
        </article>
      </main>

      <RecentPost />
    </div>
  );
};

export default PostClientView;
