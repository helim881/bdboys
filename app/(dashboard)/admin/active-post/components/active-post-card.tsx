"use client";

import { PostWithRelations } from "@/interface/type";
import Link from "next/link";

interface PostCardProps {
  post: any; // Use our strict relational type
  setIsCreating: (value: boolean) => void;
  setActivePost: (post: PostWithRelations) => void;
}

export default function ActivePostCard({
  post,
  setActivePost,
  setIsCreating,
}: PostCardProps) {
  const handleMoveTrigger = () => {
    setActivePost(post); // 1. Set the specific post data to be moved
    setIsCreating(true); // 2. Open the modal/form
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 group">
      {/* Thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
        <img
          src={post.image || "/placeholder.jpg"}
          alt={post.title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Title */}
        <Link
          href={`/posts/${post.slug}`}
          className="text-[#3366cc] font-medium text-lg leading-snug hover:underline line-clamp-2 mb-1"
        >
          {post.title}
        </Link>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="opacity-70">On :</span>
            <Link
              href={`/category/${post.category?.slug}`}
              className="text-[#3366cc] hover:underline"
            >
              {post.category?.name}
            </Link>

            {/* Improved safe check for subcategory */}
            {post.subCategory?.slug && (
              <>
                <span className="text-gray-300">›</span>
                <Link
                  href={`/category/${post.category?.slug}/${post.subCategory.slug}`}
                  className="text-[#3366cc] hover:underline"
                >
                  {post.subCategory.name}
                </Link>
              </>
            )}
          </span>

          <span className="text-gray-300">|</span>

          <Link
            href={`/profile/${post?.author?.id}`}
            className="flex items-center gap-1"
          >
            <span className="opacity-70">By :</span>
            <span className="text-gray-700 font-medium">
              {post.author?.name || "Admin"}
            </span>
          </Link>

          <span className="text-gray-300">|</span>

          {/* Fixed Move Action Button */}
          <button
            type="button"
            className="flex items-center gap-1 text-[#3366cc] hover:text-blue-800 font-medium transition-colors"
            onClick={handleMoveTrigger}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}
