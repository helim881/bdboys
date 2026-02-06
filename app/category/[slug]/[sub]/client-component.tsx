"use client";

import PostCard from "@/components/landing-page/post-card";
import CreatePost from "@/components/post-create-form";
import Link from "next/link"; // Import Link for navigation

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ClientComponentProps = {
  subcategory: any;
  meta?: any;
  basePath: string; // The URL path for pagination links
};

export default function ClientComponent({
  subcategory,
  meta,
  basePath,
}: ClientComponentProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  // Check user login session
  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);

  const { page, totalPages } = meta;

  return (
    <section className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      {isLoggedIn && (
        <div className="w-full flex justify-end p-4">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-blue-700 font-semibold text-sm hover:underline"
          >
            {isCreating ? "Back to Posts" : "Create Post"}
          </button>
        </div>
      )}

      <div className="bg-[#E9F1F7] px-4 py-3 border-b border-[#B8D1E5] flex justify-between items-center">
        <div>
          <h1 className="text-[#003366] font-bold text-xl">
            {subcategory.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {subcategory.name} বিষয়ক সকল পোস্ট এখানে পাওয়া যাবে।
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {isCreating ? (
          isLoggedIn ? (
            <div className="mt-6 p-4 border border-gray-200 rounded-md shadow-sm">
              {subcategory?.id && subcategory?.categoryId && (
                <CreatePost
                  subCategoryId={subcategory?.id}
                  categoryId={subcategory?.categoryId}
                  setIsCreating={setIsCreating}
                />
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-red-500 font-semibold">
              আপনাকে পোস্ট করার জন্য লগইন করতে হবে।
            </div>
          )
        ) : subcategory.posts.length > 0 ? (
          <>
            {subcategory.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* --- Pagination UI --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-6 bg-gray-50">
                <Link
                  href={`${basePath}?page=${page - 1}`}
                  className={`px-3 py-1 text-sm border rounded ${
                    page <= 1
                      ? "bg-gray-100 text-gray-400 pointer-events-none"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Previous
                </Link>

                <div className="text-sm text-gray-600 font-medium px-4">
                  Page {page} of {totalPages}
                </div>

                <Link
                  href={`${basePath}?page=${page + 1}`}
                  className={`px-3 py-1 text-sm border rounded ${
                    page >= totalPages
                      ? "bg-gray-100 text-gray-400 pointer-events-none"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="p-10 text-center text-gray-400">
            এই সাব-ক্যাটেগরিতে বর্তমানে কোনো পোস্ট নেই।
          </div>
        )}
      </div>
    </section>
  );
}
