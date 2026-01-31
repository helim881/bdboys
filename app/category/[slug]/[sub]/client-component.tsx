"use client";

import PostCard from "@/components/landing-page/post-card";
import CreatePost from "@/components/post-create-form";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ClientComponentProps = {
  subcategory: any;
};

export default function ClientComponent({ subcategory }: ClientComponentProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  // Check user login session
  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);
  return (
    <section className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#E9F1F7] px-4 py-3 border-b border-[#B8D1E5] flex justify-between items-center">
        <div>
          <h1 className="text-[#003366] font-bold text-xl">
            {subcategory.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {subcategory.name} বিষয়ক সকল পোস্ট এখানে পাওয়া যাবে।
          </p>
        </div>

        {/* Toggle Create Post (only if logged in) */}
        {isLoggedIn && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-blue-700 font-semibold text-sm hover:underline"
          >
            {isCreating ? "Back to Posts" : "Create Post"}
          </button>
        )}
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
          subcategory.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="p-10 text-center text-gray-400">
            এই সাব-ক্যাটেগরিতে বর্তমানে কোনো পোস্ট নেই।
          </div>
        )}
      </div>
    </section>
  );
}
