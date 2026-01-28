import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SmsCard from "../components/sms-card";

// ১. মেটাডেটা জেনারেটর ফাংশন

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Await params (Required in Next.js 15)
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 2. Query the CATEGORY table (not the SMS table) to get meta info
  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug },
    select: {
      name: true,
      description: true,
    },
  });

  // 3. Fallback if category doesn't exist
  if (!category) {
    return {
      title: "ক্যাটেগরি পাওয়া যায়নি | BDBOYS",
    };
  }

  // 4. Professional Bangla SEO Title & Description
  const seoTitle = `${category.name} SMS - সেরা সব ${category.name} স্ট্যাটাস সংগ্রহ | BDBOYS`;
  const seoDesc =
    category.description ||
    `${category.name} সম্পর্কিত লেটেস্ট এবং সেরা সব বাংলা SMS, স্ট্যাটাস এবং ক্যাপশন এখন একসাথেই। কপি করুন এবং শেয়ার করুন বন্ধুদের সাথে।`;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: `/category/${decodedSlug}`,
    },
    openGraph: {
      title: `${category.name} বাংলা SMS সংগ্রহ - BDBOYS`,
      description: seoDesc,
      url: `https://yourdomain.com/category/${decodedSlug}`,
      siteName: "BDBOYS",
      locale: "bn_BD", // Very important for Bangla SEO
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
    },
    // Adding keywords helps some search engines
    keywords: [
      `${category.name}`,
      "Bangla SMS",
      "বাংলা স্ট্যাটাস",
      "BDBOYS SMS",
    ],
  };
}

type Props = {
  params: Promise<{ slug: string; sub: string }>;
};

export default async function CategoryPageSms({ params }: Props) {
  const { slug, sub } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Fetch Category with nested Subcategories and their SMS counts
  const categoryData = await prisma.category.findUnique({
    where: { slug: decodedSlug },
    include: {
      // Get subcategories and count how many SMS each has
      subCategories: {
        include: {
          _count: {
            select: { sms: true },
          },
        },
      },
      // Get the actual SMS list for the main category
      sms: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!categoryData) {
    notFound();
  }

  return (
    <main className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="  bg-white shadow-sm border border-gray-300 rounded-sm">
        {/* Breadcrumb Area */}
        <div className="p-2 text-sm text-[#003366] border-b border-gray-200 bg-white">
          <Breadcrumb />
        </div>

        {/* Main Header */}
        <div className="bg-[#EFEFEF] py-1.5 border-b border-gray-300 text-center">
          <h1 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
            {categoryData.name}
          </h1>
        </div>

        {/* SMS List Section */}
        <div className="divide-y divide-gray-200">
          {categoryData.sms.length > 0 ? (
            categoryData.sms.map((item, index) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <SmsCard sms={item} index={index} />
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500 italic">
              No SMS available in this category.
            </div>
          )}
        </div>

        {/* Category Section Header */}
        <div className="bg-[#EFEFEF] py-1.5 border-t border-b border-gray-300 text-center mt-4">
          <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
            {categoryData.name} Category
          </h2>
        </div>

        {/* Sub-Category List (Matching the Screenshot Style) */}
        <div className="bg-white">
          {categoryData.subCategories.length > 0 ? (
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {categoryData.subCategories.map((sub) => (
                <a
                  key={sub.id}
                  href={`/sms/${decodedSlug}/${sub.slug}`}
                  className="flex items-center p-3 text-[14px] text-[#003366] hover:bg-blue-50 transition-colors group"
                >
                  <span className="mr-2 text-gray-400 group-hover:text-blue-600">
                    ›
                  </span>
                  <span className="font-medium hover:underline">
                    {sub.name}
                  </span>
                  <span className="ml-1 text-gray-600 font-normal">
                    ({sub._count.sms})
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 text-xs text-gray-400 text-center">
              No sub-categories available.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
