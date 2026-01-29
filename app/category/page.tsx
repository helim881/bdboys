import Breadcrumb from "@/components/breadcumb";
import PostCard from "@/components/landing-page/post-card";
import { ApiResponse } from "@/types/common";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "পোস্ট পোর্টাল | BDBOYS",
  description:
    "BDBOYS এর সকল ক্যাটেগরির লেটেস্ট পোস্ট এবং আপডেটসমূহ এখানে দেখুন।",
};

// 🚀 Dynamic page (no cache)
export const dynamic = "force-dynamic";

type Post = {
  id: string;
  title: string;
  slug: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  posts: Post[];
};

export default async function PostPortal() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/post`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result: ApiResponse<Category[]> = await res.json();
  const categoriesWithPosts = result.data;

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <Breadcrumb />

      {categoriesWithPosts.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          কোনো পোস্ট পাওয়া যায়নি।
        </p>
      )}

      {categoriesWithPosts?.map((category) => (
        <section
          key={category.id}
          className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#E9F1F7] px-4 py-2 flex justify-between items-center border-b border-[#B8D1E5]">
            <h2 className="text-[#003366] font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-6 bg-[#003366] inline-block rounded-sm" />
              {category.name}
            </h2>

            <Link
              href={`/category/${encodeURIComponent(category.slug)}`}
              className="text-blue-700 text-sm hover:underline font-bold"
            >
              আরও দেখুন →
            </Link>
          </div>

          {/* Posts */}
          <div className="divide-y divide-gray-100">
            {category.posts.length > 0 ? (
              category.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="p-4 text-xs text-gray-400">
                এই ক্যাটেগরিতে কোনো পোস্ট নেই।
              </p>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
