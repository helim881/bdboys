"use client";

import {
  createComment,
  deletePostAction,
  toggleLike,
} from "@/actions/action.post";
import Breadcrumb from "@/components/breadcumb";
import RecentPost from "@/components/recentpost";
import {
  Facebook,
  Heart,
  HeartCrack,
  LogIn,
  MessageSquare,
  Send,
  SendHorizontal,
  Twitter,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UpdatePostModal from "../../update-dialog";
import { WatermarkedImage } from "./watermarkimage";

const PostClientView = ({
  post,
  stats,
}: {
  post: any;
  stats?: any | { postCount: number; totalViewsByAuthor: number };
}) => {
  const [open, setOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likeCount || 0); // Local like count
  const session = useSession();
  const user = session?.data?.user;
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allComments, setAllComments] = useState(post.comments || []); // Initialize with existing
  const [ads, setAds] = useState({ onArticle: "", afterArticle: "" });
  const [siteName, setSiteName] = useState("BDBOYS.COM");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  useEffect(() => {
    // Check localStorage if the user has already liked this post (Simple client-side persistence)
    const hasLiked = localStorage.getItem(`liked_${post.id}`);
    if (hasLiked) setIsLiked(true);

    const fetchData = async () => {
      try {
        const [onRes, afterRes, settingsRes, comments] = await Promise.all([
          fetch("/api/ads/on_article_ad"),
          fetch("/api/ads/after_article_ad"),
          fetch("/api/site-setting"),
          fetch(`/api/comments/${post.id}`),
        ]);

        const onData = await onRes.json();
        const afterData = await afterRes.json();
        const settingsData = await settingsRes.json();
        const result = await comments.json();

        setAllComments(result);
        setAds({
          onArticle: onData.status === "active" ? onData.code : "",
          afterArticle: afterData.status === "active" ? afterData.code : "",
        });

        if (settingsData?.siteName) setSiteName(settingsData.siteName);
      } catch (err) {
        console.error("Data fetch failed", err);
      }
    };
    fetchData();
  }, [post.id]);
  const router = useRouter();
  // --- NEW LIKE FUNCTION ---
  const handleLike = async () => {
    const newStatus = !isLiked;
    const action = newStatus ? "like" : "unlike";

    // 1. Optimistic UI update
    setIsLiked(newStatus);
    setLikes((prev: number) => (newStatus ? prev + 1 : prev - 1));

    // 2. Call Server Action
    const result = await toggleLike(post.id, action);

    if (result.success) {
      // Update with actual DB count
      setLikes(result.newCount);
      if (newStatus) {
        localStorage.setItem(`liked_${post.id}`, "true");
      } else {
        localStorage.removeItem(`liked_${post.id}`);
      }
    } else {
      // Rollback on failure
      setIsLiked(!newStatus);
      setLikes((prev: number) => (newStatus ? prev - 1 : prev + 1));
      alert("Error updating like. Please try again.");
    }
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
      "_blank",
    );
  };
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.name) return alert("লগইন করুন");
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const result = await createComment(post.id, user?.name, commentText);

    if (result.success) {
      setAllComments([result.comment, ...allComments]);
      setCommentText("");
    }
    setIsSubmitting(false);
  };
  const renderContentWithAds = (content: string, adCode: string) => {
    if (!adCode) return <div dangerouslySetInnerHTML={{ __html: content }} />;
    const paragraphs = content.split("</p>");
    if (paragraphs.length > 1) {
      paragraphs[0] =
        paragraphs[0] +
        `</p><div class="my-6 flex justify-center">${adCode}</div>`;
      return (
        <div dangerouslySetInnerHTML={{ __html: paragraphs.join("</p>") }} />
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  const handleRemove = async (id: string) => {
    await deletePostAction(id);
    router.push("/posts");
  };
  const hasPrivilege = ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user?.role);
  const isOwner = user?.id === post.authorId;
  return (
    <>
      <Breadcrumb />
      {open ? (
        <UpdatePostModal post={post} setOpen={setOpen} />
      ) : (
        <main className="container py-8">
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
            {/* Featured Image */}
            <div className="p-4 prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-[#003366] border-b border-gray-200">
              {/* Post Title */}
              <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>

              {/* Meta Info */}
              <div className="text-sm text-gray-600 flex flex-wrap gap-4 items-center">
                <span>
                  In <strong>{post?.category?.name}</strong>
                </span>

                {/* Formatted Date */}
                <span>
                  {post?.createdAt
                    ? new Date(post.createdAt).toLocaleString("bn-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>

                <span>Views: {post?.views ?? 0}</span>

                {hasPrivilege ||
                  (isOwner && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setOpen(true)}
                        className="text-green-200-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(post.slug)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="relative h-64 md:h-96 overflow-hidden rounded-xl">
              <WatermarkedImage
                src={post.image || "https://via.placeholder.com/1200x600"}
                alt={post.title}
                siteName={siteName}
              />
              <div className="absolute bottom-2 right-5 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                <span className="text-white font-bold uppercase">
                  {siteName}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-[#003366]">
              {renderContentWithAds(post.contentHtml, ads.onArticle)}
            </div>
            {/* Author Meta & User Stats */}
            <div className="p-4 border-y border-gray-100 flex flex-col   gap-6">
              <div className="flex items-center gap-2  ">
                <span className="text-xs font-bold text-gray-400 uppercase mr-1">
                  শেয়ার:
                </span>
                <button
                  onClick={shareOnFacebook}
                  className="p-2 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-transform"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="p-2 bg-[#000000] text-white rounded-full hover:scale-110 transition-transform"
                >
                  <Twitter className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4 fill-current rotate-[-45deg] translate-x-0.5" />
                </button>
                <button
                  className="border rounded-full  p-1 border-orange-600"
                  onClick={handleLike}
                >
                  <span className="font-bold text-sm">
                    {isLiked ? (
                      <Heart
                        className={`w-5 h-5 text-orange-600 transition-transform ${isLiked ? "fill-current scale-110" : "group-hover:scale-110 "}`}
                      />
                    ) : (
                      <HeartCrack className="text-orange-600" />
                    )}
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                {/* Author Avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0">
                  {post.author?.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="text-gray-400 w-7 h-7" />
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex-1 space-y-1">
                  <Link href={`/my/${post?.author.id}`} className="block">
                    <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {post.author?.name || "Anonymous"}
                    </h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {siteName}
                    </p>
                  </Link>

                  {/* Stats */}
                  <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                    <p>
                      <span className="font-medium">
                        {stats?.authorPostCount || 0}
                      </span>{" "}
                      posts
                    </p>
                    <p>
                      <span className="font-medium">
                        {stats?.totalViewsByAuthor?._sum?.views || 0}
                      </span>{" "}
                      views
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad After Content */}
            {ads.afterArticle && (
              <div className="w-full flex justify-center p-4">
                <div dangerouslySetInnerHTML={{ __html: ads.afterArticle }} />
              </div>
            )}

            {/* Post Actions (Like) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center"></div>
            <div className="p-6   bg-white">
              <div className="flex items-center gap-2  ">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">মন্তব্য সমূহ</h2>
              </div>

              {/* Form Conditional Rendering */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="  space-y-4">
                  <textarea
                    placeholder="আপনার মন্তব্য লিখুন..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2 shadow-md shadow-blue-200"
                  >
                    {isSubmitting ? "পাঠানো হচ্ছে..." : "মন্তব্য জমা দিন"}{" "}
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="mb-10 p-8 border-2 border-dashed border-blue-100 rounded-2xl text-center bg-blue-50/30">
                  <LogIn className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4 font-medium">
                    মন্তব্য বা লাইক দিতে আপনাকে লগইন করতে হবে।
                  </p>
                  <Link
                    href="/auth"
                    className="inline-block bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    লগইন করুন
                  </Link>
                </div>
              )}
            </div>
            {/* List */}
            <div className="space-y-6 p-4">
              {allComments.length > 0 ? (
                allComments.map((comment: any) => (
                  <div key={comment.id} className="flex flex-col gap-4 group">
                    <div className="flex-grow">
                      <div className="bg-gray-50 p-4  rounded-2xl group-hover:bg-gray-100 transition-colors border border-gray-100">
                        <div className="flex gap-2 items-start mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-bold text-blue-700 shrink-0">
                            {comment.authorName[0]}
                          </div>
                          <span className="font-bold text-gray-900">
                            {comment.authorName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "bn-BD",
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-10 italic">
                  এখনও কোনো মন্তব্য নেই।
                </p>
              )}
            </div>
          </article>
          <RecentPost />
        </main>
      )}
    </>
  );
};

export default PostClientView;
