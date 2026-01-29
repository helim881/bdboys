import ErrorPage from "@/components/error/error";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SmsCategoryClientComponent from "./client-component";

export const dynamic = "force-dynamic";

type Sms = {
  id: string;
  title: string;
  slug: string;
};

type SubCategory = {
  id: string;
  name: string;
  slug: string;
  _count: { sms: number };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subCategories: SubCategory[];
  sms: Sms[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

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

  let category: Category | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sms/${slug}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch category");

    const result: ApiResponse<Category> = await res.json();

    if (!result.success || !result.data) throw new Error("Category not found");

    category = result?.data;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }
  if (!category) {
    notFound();
  }

  return (
    <main className="bg-gray-100 min-h-screen py-6 px-4">
      <SmsCategoryClientComponent category={category} slug={slug} />
    </main>
  );
}
