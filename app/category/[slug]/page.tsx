import Breadcrumb from "@/components/breadcumb";
import ErrorPage from "@/components/error/error";
import { getSiteSettings } from "@/lib/db";
import { Metadata } from "next";
import CategoryClientComponent from "./client-component";

// প্রতিবার request এ নতুন ডাটা আনবে
export const dynamic = "force-dynamic";

type Post = {
  id: string;
  title: string;
  slug: string;
};

type SubCategory = {
  id: string;
  name: string;
  slug: string;
  posts: Post[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subCategories: SubCategory[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

/* =======================
   SEO METADATA
======================= */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${slug}`,
      { cache: "no-store" },
    );
    const siteconfig = await getSiteSettings();
    if (!res.ok) throw new Error("Failed to fetch category");

    const result: ApiResponse<Category> = await res.json();

    if (!result.success || !result.data) throw new Error("Category not found");

    const readableName = result.data.name || slug.replace(/-/g, " ");

    return {
      title: `${readableName} | ${siteconfig?.siteName}`,
      description:
        siteconfig?.description ||
        `${readableName} সম্পর্কিত সর্বশেষ খবর ও আপডেট।`,
    };
  } catch (error) {
    console.error("METADATA_FETCH_ERROR:", error);
    return {
      title: "Category Not Found | BDBOYS",
      description: "Requested category could not be found.",
    };
  }
}

/* =======================
   PAGE COMPONENT
======================= */
export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  let category: Category | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${slug}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch category");

    const result: ApiResponse<Category> = await res.json();

    if (!result.success || !result.data) throw new Error("Category not found");

    category = result.data;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb />

      <CategoryClientComponent category={category} slug={slug} />
    </main>
  );
}
