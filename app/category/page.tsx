import Breadcrumb from "@/components/breadcumb";
import PostCard from "@/components/landing-page/post-card";
import prisma from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";

// এসইও-র জন্য মেটাডেটা যোগ করা হলো
export const metadata: Metadata = {
  title: "পোস্ট পোর্টাল | BDBOYS",
  description:
    "BDBOYS এর সকল ক্যাটেগরির লেটেস্ট পোস্ট এবং আপডেটসমূহ এখানে দেখুন।",
};

export default async function PostPortal() {
  const categoriesWithPosts = await prisma.category.findMany({
    where: { type: "POST" },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <Breadcrumb />

      {categoriesWithPosts.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          কোনো পোস্ট পাওয়া যায়নি।
        </p>
      )}

      {categoriesWithPosts.map((category) => (
        <section
          key={category.id}
          className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden"
        >
          {/* Header with "View More" (আরও দেখুন) logic */}
          <div className="bg-[#E9F1F7] px-4 py-2 flex justify-between items-center border-b border-[#B8D1E5]">
            <h2 className="text-[#003366] font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-6 bg-[#003366] inline-block rounded-sm"></span>
              {category.name}
            </h2>

            {/* বাংলা স্লাগ সাপোর্ট করার জন্য encodeURIComponent ব্যবহার করা হয়েছে */}
            <Link
              href={`/category/${encodeURIComponent(category.slug)}`}
              className="text-blue-700 text-sm hover:underline font-bold transition-all"
            >
              আরও দেখুন →
            </Link>
          </div>

          {/* Post List matching the image list style */}
          <div className="divide-y divide-gray-100">
            {category.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}

            {category.posts.length === 0 && (
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
