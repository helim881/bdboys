import defaultImg from "@/public/bdbboys-logo-og.png";
import Image from "next/image";
import Link from "next/link";
export default function PostCard({
  post,
  list = false,
}: {
  post: any;
  list?: boolean;
}) {
  return (
    <div
      key={post.id}
      className="flex p-4 gap-4 hover:bg-blue-50/30 transition-colors group cursor-pointer"
    >
      {/* Image Box */}
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

      {/* Post Content */}
      <div className="flex flex-col justify-center">
        <Link
          href={`/posts/${post?.slug}`}
          className="text-[#0056b3] font-bold text-base group-hover:underline"
        >
          {post.title}
        </Link>
        <p className="text-gray-500 text-sm line-clamp-1 mt-1">
          {post.content
            ? post.content.replace(/<[^>]*>/g, "") // 🛠️ Strips all HTML tags
            : "বিস্তারিত নেই"}
        </p>
        <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2 font-medium">
          <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-3 font-medium">
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
    </div>
  );
}
