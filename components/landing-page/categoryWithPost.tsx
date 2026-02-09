import Link from "next/link";
import PostCard from "./post-card";

export default function CategoryWithPost({
  category,
  index,
}: {
  category: any;
  index?: number;
}) {
  return (
    <section
      key={category.id}
      className="bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden"
    >
      {/* Header with "View More" (আরও দেখুন) logic */}
      <div className="bg-[#E9F1F7] px-4 py-2 flex justify-between items-center border-b border-[#B8D1E5]">
        <h2 className="text-[#003366] font-bold text-lg flex items-center gap-2">
          {category.name}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="text-blue-600 text-sm hover:underline font-semibold"
        >
          আরও দেখুন →
        </Link>
      </div>

      {/* Post List matching the image list style */}
      <div className="divide-y divide-gray-100">
        {category.posts.map((post: any) => (
          <PostCard post={post} />
        ))}
      </div>
    </section>
  );
}
