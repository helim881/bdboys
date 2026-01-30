import Breadcrumb from "@/components/breadcumb";
import ErrorPage from "@/components/error/error";
import { Category, Post, SubCategory } from "@/interface/type";
import { ApiResponse } from "@/types/common";
import ClientComponent from "./client-component";

export const dynamic = "force-dynamic";

/** * Relational interface extending the base SubCategory
 * This ensures strict type safety for the posts array.
 */
export interface SubCategoryWithPosts extends SubCategory {
  posts: Post[];
  category?: Category;
  _count?: {
    posts: number;
    sms: number;
  };
}

// In Next.js 15, params is a Promise. If using 14, remove 'await'
interface PageProps {
  params: Promise<{ categorySlug: string; slug: string; sub: string }>;
}

export default async function SubCategoryPage({ params }: PageProps) {
  // 1. Await and Destructure params
  const { slug, sub } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedSub = decodeURIComponent(sub);

  let subcategory: SubCategoryWithPosts | null = null;

  // 2. Data Fetching Logic
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${decodedSlug}/${decodedSub}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return <ErrorPage />;
    }

    const result: ApiResponse<SubCategoryWithPosts> = await res.json();

    if (!result.success || !result.data) {
      return <ErrorPage />;
    }

    subcategory = result.data;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }

  // 3. Render
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <Breadcrumb />

      {/* Pass the typed subcategory to your Client Component.
         The Client Component should receive it as:
         { subcategory: SubCategoryWithPosts }
      */}
      <ClientComponent subcategory={subcategory} />
    </main>
  );
}
