import defaultImg from "@/public/bdbboys-logo-og.png";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({
  post,
  list = false,
  index,
}: {
  post: any;
  list?: boolean;
  index?: number;
}) {
  return (
    <div
      key={post.id}
      className="flex p-4 gap-4 hover:bg-blue-50/30 transition-colors group cursor-pointer items-start"
    >
      {/* 1. Index Numbering */}
      {typeof index === "number" && (
        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-500 rounded-full text-xs font-bold mt-1">
          {index + 1}
        </div>
      )}

      {/* 2. Image Box */}
      <div className="w-24 h-24 bg-gray-200 flex-shrink-0 border border-gray-300 rounded overflow-hidden relative">
        {post?.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <Image
            src={defaultImg}
            alt={post.title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>

      {/* 3. Post Content */}
      <div className="flex flex-col flex-1">
        <Link
          href={`/posts/${post?.slug}`}
          className="text-[#0056b3] font-bold text-base group-hover:underline"
        >
          {post.title}
        </Link>

        <p className="text-gray-500 text-sm line-clamp-1 mt-1">
          {post.content
            ? post.content.replace(/<[^>]*>/g, "")
            : "বিস্তারিত নেই"}
        </p>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 mt-3 font-medium">
          <span>👤 {post.author?.name || "Admin"}</span>
          <span>
            📅{" "}
            {post?.date ??
              new Date(post?.createdAt).toLocaleDateString("bn-BD", {
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
  );
}
