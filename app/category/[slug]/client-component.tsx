"use client";
import CreateSubCategoryForm from "@/components/crate-subcategory-form";
import PostCard from "@/components/landing-page/post-card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "./page";

export default function CategoryClientComponent({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);

  return (
    <div>
      <div className="bg-[#E9F1F7] px-4 py-3 border-b border-[#B8D1E5] flex justify-between items-center">
        <div>
          <h1 className="text-[#003366] font-bold text-xl">{category.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {category.name} বিষয়ক সকল পোস্ট এখানে পাওয়া যাবে।
          </p>
        </div>

        {/* Toggle Create Post (only if logged in) */}
        {isLoggedIn && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-blue-700 font-semibold text-sm hover:underline"
          >
            {isCreating ? "Back to Category" : "Create subcategory"}
          </button>
        )}
      </div>
      {!isCreating ? (
        <div className="space-y-12">
          {category.subCategories.length > 0 ? (
            category.subCategories.map((sub) => (
              <section
                key={sub.id}
                className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden"
              >
                {/* Header with "View More" */}
                <div className="bg-[#E9F1F7] px-4 py-2 flex justify-between items-center border-b border-[#B8D1E5]">
                  <h2 className="text-[#003366] font-bold text-lg">
                    {sub.name}
                  </h2>

                  <Link
                    href={`/category/${slug}/${encodeURIComponent(sub.slug)}`}
                    className="text-blue-600 text-sm hover:underline font-semibold"
                  >
                    আরও দেখুন →
                  </Link>
                </div>

                {/* Post List */}
                <div className="divide-y divide-gray-100">
                  {sub.posts.length > 0 ? (
                    sub.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <p className="p-4 text-xs text-gray-400">
                      এই সাব-ক্যাটাগরিতে কোনো পোস্ট নেই।
                    </p>
                  )}
                </div>
              </section>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10">
              কোনো সাব-ক্যাটাগরি পাওয়া যায়নি।
            </p>
          )}
        </div>
      ) : (
        <CreateSubCategoryForm
          categoryId={category?.id}
          setIsCreating={setIsCreating}
        />
      )}
    </div>
  );
}
