"use client";
import CreateSubCategoryForm from "@/components/crate-subcategory-form";
import PostCard from "@/components/landing-page/post-card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryClientComponent({
  category,
  slug,
  meta,
}: {
  category: any;
  slug: string;
  meta?: any;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);

  // Pagination logic helpers
  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <div>
      <div className="bg-[#E9F1F7]   py-3 border-b border-[#B8D1E5] flex justify-between items-center">
        <div>
          <h1 className="text-[#003366] font-bold text-xl">{category.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {category.name} বিষয়ক সকল পোস্ট এখানে পাওয়া যাবে।
          </p>
        </div>

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
        <div className="space-y-12 mt-6">
          {category.subCategories.length > 0 ? (
            <>
              {category.subCategories.map((sub: any) => (
                <section
                  key={sub.id}
                  className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden"
                >
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

                  <div className="divide-y divide-gray-100">
                    {sub.posts.length > 0 ? (
                      sub.posts.map((post: any) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <p className="p-4 text-xs text-gray-400">
                        এই সাব-ক্যাটাগরিতে কোনো পোস্ট নেই।
                      </p>
                    )}
                  </div>
                </section>
              ))}

              {/* --- PAGINATION UI --- */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8 pb-10">
                  <Link
                    href={`/category/${slug}?page=${currentPage - 1}`}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      currentPage <= 1
                        ? "pointer-events-none opacity-50 bg-gray-100"
                        : "hover:bg-gray-50 text-blue-600"
                    }`}
                  >
                    Previous
                  </Link>

                  <div className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Link
                    href={`/category/${slug}?page=${currentPage + 1}`}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50 bg-gray-100"
                        : "hover:bg-gray-50 text-blue-600"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400 py-10">
              কোনো সাব-ক্যাটাগরি পাওয়া যায়নি।
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
