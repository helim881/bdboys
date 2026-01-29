import ErrorPage from "@/components/error/error";
import { ApiResponse } from "@/types/common";
import { notFound } from "next/navigation";
import ClientCmsComponent from "./client-sms-component";
export const dynamic = "force-dynamic";
type Sms = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  subCategoryId: string;
};
type SubCategory = {
  id: string;
  name: string;
  slug: string;
  sms: Sms[];
};

type Props = {
  params: Promise<{ slug: string; sub: string }>;
};

export default async function SubCategoryPage({ params }: Props) {
  const { slug, sub } = await params;
  const decodedSlug = decodeURIComponent(sub);

  let subCategoryData: SubCategory | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sms/${slug}/${decodedSlug}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch category");

    const result: ApiResponse<SubCategory> = await res.json();

    if (!result.success || !result.data) throw new Error("Category not found");

    subCategoryData = result?.data;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }
  if (!subCategoryData) {
    notFound();
  }

  return <ClientCmsComponent subCategoryData={subCategoryData} />;
}
