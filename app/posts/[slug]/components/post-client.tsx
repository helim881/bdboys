"use client";

import RecentPost from "@/components/recentpost";
import { Calendar, Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { WatermarkedImage } from "./watermarkimage";

const PostClientView = ({ post }: { post: any }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [ads, setAds] = useState({ onArticle: "", afterArticle: "" });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const [onRes, afterRes] = await Promise.all([
          fetch("/api/ads/on_article_ad"),
          fetch("/api/ads/after_article_ad"),
        ]);
        const onData = await onRes.json();
        const afterData = await afterRes.json();

        setAds({
          onArticle: onData.status === "active" ? onData.code : "",
          afterArticle: afterData.status === "active" ? afterData.code : "",
        });
      } catch (err) {
        console.error("Ads fetch failed", err);
      }
    };
    fetchAds();
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Logic to inject ad after the first paragraph
  const renderContentWithAds = (content: string, adCode: string) => {
    if (!adCode) return <div dangerouslySetInnerHTML={{ __html: content }} />;

    const paragraphs = content.split("</p>");
    if (paragraphs.length > 1) {
      // Injecting ad after the first paragraph
      paragraphs[0] =
        paragraphs[0] +
        `</p><div class="my-6 flex justify-center">${adCode}</div>`;
      return (
        <div dangerouslySetInnerHTML={{ __html: paragraphs.join("</p>") }} />
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          {/* Featured Image */}
          <div className="relative h-64 md:h-96 overflow-hidden rounded-xl">
            <WatermarkedImage
              src={post.image || "https://via.placeholder.com/1200x600"}
              alt={post.title}
              siteName="BDBOYS.COM" // 🛠️ Pass your site name here
            />

            {/* The gradient overlay can stay for UI beauty, but the watermark is in the pixels */}
            <div className="absolute  bottom-2 right-5 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
              <span className="text-white font-bold"> BDBOYS.COM</span>
            </div>
          </div>

          {/* Post Meta */}
          <div className="p-6 border-b border-gray-100">
            {/* ... existing author meta code ... */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("bn-BD")}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views} ভিউ</span>
              </div>
            </div>
          </div>

          {/* 🚀 Placement: Ad On Articles (Inside Content) */}
          <div className="p-8 prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-[#003366]">
            {renderContentWithAds(post.contentHtml, ads.onArticle)}
          </div>
          {ads.afterArticle && (
            <div className="mb-8 w-full flex justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div dangerouslySetInnerHTML={{ __html: ads.afterArticle }} />
            </div>
          )}

          {/* Post Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
                isLiked
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-bold">
                {isLiked ? "লাইক দেওয়া হয়েছে" : "লাইক দিন"}
              </span>
            </button>
          </div>
        </article>

        {/* 🚀 Placement: Ad After Articles */}

        <RecentPost />
      </main>
    </div>
  );
};

export default PostClientView;
