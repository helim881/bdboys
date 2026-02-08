"use client";

import {
  createComment,
  deletePostAction,
  toggleLike,
} from "@/actions/action.post";
import Breadcrumb from "@/components/breadcumb";
import RecentPost from "@/components/recentpost";
import {
  ChevronRight,
  Eye,
  Facebook,
  FileText,
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
  console.log(post);
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
    if (!user?.id) return alert("লগইন করুন");
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const result = await createComment(post.id, user?.id, commentText);

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

                {(hasPrivilege || isOwner) && (
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
                )}
              </div>
            </div>

            <div className="relative   h-64 md:h-96 overflow-hidden rounded-xl">
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
            <div className="px-4 flex flex-col   gap-2">
              <div className="flex items-center gap-3 py-4 border-y border-gray-100 my-6">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">
                  শেয়ার করুন:
                </span>

                <div className="flex items-center gap-2">
                  {/* Social Buttons (Same as before) */}
                  <button
                    onClick={shareOnFacebook}
                    className="group p-2.5 bg-gray-50 hover:bg-[#1877F2] text-gray-600 hover:text-white rounded-xl transition-all duration-300"
                  >
                    <Facebook className="w-4 h-4 fill-none group-hover:fill-current" />
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="group p-2.5 bg-gray-50 hover:bg-black text-gray-600 hover:text-white rounded-xl transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4 fill-none group-hover:fill-current" />
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="group p-2.5 bg-gray-50 hover:bg-[#25D366] text-gray-600 hover:text-white rounded-xl transition-all duration-300"
                  >
                    <Send className="w-4 h-4 rotate-[-45deg] translate-x-0.5" />
                  </button>
                </div>

                <div className="h-6 w-[1px] bg-gray-200 mx-2" />

                {/* Like Button with Count */}
                <button
                  onClick={handleLike}
                  className={`group flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-500 ${
                    isLiked
                      ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm"
                      : "bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {isLiked ? (
                      <Heart className="w-5 h-5 fill-current animate-bounce-short" />
                    ) : (
                      <HeartCrack className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">|</span>

                    <span
                      className={`px-1.5 py-0.5 rounded-md text-xs font-black tracking-tighter ${
                        isLiked
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-orange-200"
                      }`}
                    >
                      {post.likeCount > 0 ? post.likeCount : 0}
                    </span>
                  </div>
                </button>
              </div>
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-2 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-5">
                  {/* Author Avatar - Advanced Styling */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300 shadow-inner">
                      {post.author?.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                          <User className="text-gray-400 w-8 h-8" />
                        </div>
                      )}
                    </div>
                    {/* Verified Badge (Optional) */}
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-white shadow-sm">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Author Info & Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/my/${post?.author.id}`}
                          className="inline-flex items-center gap-1 group/name"
                        >
                          <h4 className="text-xl font-bold text-gray-900 group-hover/name:text-blue-600 transition-colors truncate">
                            {post.author?.name || "Anonymous"}
                          </h4>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover/name:text-blue-600 group-hover/name:translate-x-1 transition-all" />
                        </Link>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[2px] mt-0.5">
                          Verified Author • {siteName}
                        </p>
                      </div>
                    </div>

                    {/* Modern Stats Display */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">
                          {stats?.postCount || 0}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          Posts
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3   bg-gray-50 rounded-lg border border-gray-100">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">
                          {stats?.totalViewsByAuthor?._sum?.views || 0}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          Views
                        </span>
                      </div>
                    </div>
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
                        <div className="flex gap-3 items-center mb-3">
                          {/* Avatar Section */}
                          <div className="relative shrink-0">
                            {comment.user?.image ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300 shadow-inner">
                                {comment?.user?.image ? (
                                  <Image
                                    src={comment?.user?.image}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                                    <User className="text-gray-400 w-8 h-8" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm ring-2 ring-white">
                                {comment?.user?.name?.charAt(0).toUpperCase()}
                              </div>
                            )}

                            {/* ছোট অনলাইন ডট বা স্ট্যাটাস (Optional) */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          {/* Name & Date Section */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[15px] text-gray-900 leading-none hover:text-blue-600 cursor-pointer transition-colors">
                                {comment?.user?.name}
                              </span>
                              {/* ভেরিফাইড ব্যাজ (যদি আপনার সিস্টেমে থাকে) */}
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-2 h-2 text-white fill-current"
                                >
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              </div>
                            </div>

                            <span className="text-[11px] text-gray-400 mt-1 font-medium italic">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "bn-BD",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 md:pl-8 text-sm leading-relaxed">
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
