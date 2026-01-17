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
        <img
          src={post.image}
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
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
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2 font-medium">
          <span>👤 {post.author}</span>
          <span>📅 {post.date}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded text-[#003366]">
            ❤️ {post.likes}
          </span>
        </div>
      </div>
    </div>
  );
}
