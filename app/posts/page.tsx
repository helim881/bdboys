import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { ChevronLeft, ChevronRight } from "lucide-react"; // আইকন
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "সর্বশেষ পোস্টসমূহ | BDBOYS",
  description: "আমাদের সাইটের সর্বশেষ আপডেট এবং খবরসমূহ সবার আগে পড়ুন।",
};

export default async function PostsListPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const totalPosts = await prisma.post.count({
    where: { status: "PUBLISHED" },
  });

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: skip,
  });

  const totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="border-b-2 border-[#003366] mb-8 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">সর্বশেষ আপডেট</h1>
          <p className="text-gray-500 mt-1">
            সবচেয়ে সাম্প্রতিক খবর ও পোস্টসমূহ
          </p>
        </div>
        <div className="text-sm font-bold text-gray-400">
          মোট পোস্ট: {totalPosts}
        </div>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex p-4 gap-4 hover:bg-blue-50/30 transition-all group border border-gray-100 hover:border-blue-100 rounded shadow-sm"
            >
              {/* Image Box */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 flex-shrink-0 border border-gray-300 rounded overflow-hidden relative">
                <img
                  src={post.image || "/placeholder.jpg"}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Post Content */}
              <div className="flex flex-col justify-center flex-1">
                <Link
                  href={`/posts/${encodeURIComponent(post.slug)}`}
                  className="text-[#0056b3] font-bold text-base sm:text-lg group-hover:text-[#003366]"
                >
                  {post.title}
                </Link>

                <p className="text-gray-500 text-sm line-clamp-1 mt-1">
                  {post.content?.substring(0, 100) ||
                    "বিস্তারিত পড়তে ক্লিক করুন..."}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-3 font-medium">
                  <span>👤 {post.author?.name || "Admin"}</span>
                  <span>
                    📅{" "}
                    {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="bg-blue-50 px-2 py-0.5 rounded text-[#003366]">
                    ❤️ {post.views || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-400 border-2 border-dashed rounded-lg">
            কোনো পোস্ট পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* ৩. Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          {/* Previous Button */}
          {currentPage > 1 && (
            <Link
              href={`?page=${currentPage - 1}`}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium transition-all"
            >
              <ChevronLeft size={16} />
            </Link>
          )}

          {/* Page Numbers (মোবাইলে লুকানোর জন্য hidden sm:flex) */}
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={`?page=${pageNum}`}
                  className={`px-3 py-1.5 rounded border text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? "bg-[#003366] text-white border-[#003366]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {pageNum.toLocaleString("bn-BD")}
                </Link>
              );
            })}
          </div>

          {/* Next Button */}
          {currentPage < totalPages && (
            <Link
              href={`?page=${currentPage + 1}`}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium transition-all"
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
