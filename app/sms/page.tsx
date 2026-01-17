"use client";
import Breadcrumb from "@/components/breadcumb";
import { categoriesData } from "@/components/landing-page/data";
import SmsSection from "./components/sms-section";

export default function SmsZonePage() {
  return (
    <div className=" container pt-4">
      {/* Breadcrumb matching image_191441.png */}
      <div className="bg-[#E9F1F7] p-2 mb-4 border border-[#B8D1E5]">
        <Breadcrumb />
      </div>

      {categoriesData.map((cat) => (
        <SmsSection
          key={cat.id}
          title={cat.name}
          viewMoreLink={`/${cat.id}`}
          smsList={cat.posts.map((post) => ({
            id: post.id,
            content: post.excerpt,
            category: cat.name,
            author: post.author,
            categorySlug: cat.id,
          }))}
        />
      ))}
    </div>
  );
}
