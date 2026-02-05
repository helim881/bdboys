import Breadcrumb from "@/components/breadcumb";
import ErrorPage from "@/components/error/error";
import { Category, Post, SubCategory } from "@/interface/type";
import { ApiResponse } from "@/types/common";
import ClientComponent from "./client-component";

export const dynamic = "force-dynamic";

export interface SubCategoryWithPosts extends SubCategory {
  posts: Post[];
  category?: Category;
  _count?: {
    posts: number;
    sms: number;
  };
}

// searchParams is now a Promise in Next.js 15
interface PageProps {
  params: Promise<{ categorySlug: string; slug: string; sub: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function SubCategoryPage({
  params,
  searchParams,
}: PageProps) {
  // 1. Await both params and searchParams
  const { slug, sub } = await params;
  const { page } = await searchParams;

  const decodedSlug = decodeURIComponent(slug);
  const decodedSub = decodeURIComponent(sub);
  const currentPage = parseInt(page || "1");

  let subcategory: SubCategoryWithPosts | null = null;
  let meta = { page: 1, limit: 10, total: 0, totalPage: 1 };

  try {
    // 2. Pass page to the API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${decodedSlug}/${decodedSub}?page=${currentPage}&limit=${10}`,
      { cache: "no-store" },
    );

    if (!res.ok) return <ErrorPage />;

    const result: ApiResponse<SubCategoryWithPosts> & { meta?: any } =
      await res.json();

    if (!result.success || !result.data) return <ErrorPage />;

    subcategory = result.data;
    meta = result.meta || meta;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }

  return (
    <main className="container    py-6 space-y-6">
      <Breadcrumb />
      {/* Pass subcategory, meta, and the base slug for link construction */}
      <ClientComponent
        subcategory={subcategory}
        meta={meta}
        basePath={`/category/${slug}/${sub}`}
      />
    </main>
  );
}
