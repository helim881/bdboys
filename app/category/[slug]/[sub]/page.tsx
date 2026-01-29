import Breadcrumb from "@/components/breadcumb";
import PostCard from "@/components/landing-page/post-card";
import { NotFound } from "@/components/not-found";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function SubCategoryPage({
  params,
}: {
  params: { categorySlug: string; slug: string; sub: string };
}) {
  const { slug, sub } = params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedSub = decodeURIComponent(sub);

  // Fetch the sub-category and its 5 posts
  const subCategory = await prisma.subCategory.findUnique({
    where: { slug: decodedSub },
    include: {
      category: true,
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!subCategory) {
    return <NotFound />;
  }

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <Breadcrumb />

      <section className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden">
        {/* Header showing Category > SubCategory */}
        <div className="bg-[#E9F1F7] px-4 py-3 border-b border-[#B8D1E5]">
          <h1 className="text-[#003366] font-bold text-xl">
            {subCategory.category.name}{" "}
            <span className="text-gray-400 mx-2">/</span> {subCategory.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {subCategory.name} বিষয়ক সকল পোস্ট এখানে পাওয়া যাবে।
          </p>
        </div>

        {/* Post List */}
        <div className="divide-y divide-gray-100">
          {subCategory.posts.length > 0 ? (
            subCategory.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="p-10 text-center text-gray-400">
              এই সাব-ক্যাটেগরিতে বর্তমানে কোনো পোস্ট নেই।
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
