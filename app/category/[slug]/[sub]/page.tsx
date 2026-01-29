import Breadcrumb from "@/components/breadcumb";
import ErrorPage from "@/components/error/error";
import { ApiResponse } from "@/types/common";
import ClientComponent from "./client-component";
export const dynamic = "force-dynamic";
export type Post = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  subCategoryId: string;
  createdAt: Date;
  author?: { id: string; name: string };
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  category: { id: string; name: string; slug: string };
  posts: Post[];
  categoryId: string;
};

export default async function SubCategoryPage({
  params,
}: {
  params: { categorySlug: string; slug: string; sub: string };
}) {
  const { slug, sub } = params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedSub = decodeURIComponent(sub);

  let subcategory: SubCategory | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${decodedSlug}/${decodedSub}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch category");

    const result: ApiResponse<SubCategory> = await res.json();

    if (!result.success || !result.data) throw new Error("Category not found");

    subcategory = result.data;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <Breadcrumb />
      <ClientComponent subcategory={subcategory} />
    </main>
  );
}
