import ErrorPage from "@/components/error/error";
import { ApiResponse } from "@/types/common";
import ClientCmsComponent from "./client-sms-component";

export const dynamic = "force-dynamic";

// Define the expected Meta type based on your API
type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

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
  categoryId: string;
  subCategoryId: string;
};

type Props = {
  params: Promise<{ slug: string; sub: string }>;
  searchParams: Promise<{ page?: string }>; // Add searchParams
};

export default async function SubCategoryPage({ params, searchParams }: Props) {
  // 1. Await both Promises
  const { slug, sub } = await params;
  const { page } = await searchParams;

  const decodedSub = decodeURIComponent(sub);
  const currentPage = parseInt(page || "1");
  const limit = 10;

  let subCategoryData: SubCategory | null = null;
  let metaData: Meta | null = null;

  try {
    // 2. Dynamic fetch using the currentPage
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sms/${slug}/${decodedSub}?page=${currentPage}&limit=${15}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch");

    const result: ApiResponse<SubCategory> & { meta: Meta } = await res.json();

    if (!result.success || !result.data) throw new Error("Not found");

    subCategoryData = result.data;
    metaData = result.meta;
  } catch (error) {
    console.error("CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }

  return (
    <main className="container mx-auto">
      <ClientCmsComponent
        subCategoryData={subCategoryData}
        meta={metaData}
        basePath={`/category/${slug}/${sub}`} // Pass path for navigation links
      />
    </main>
  );
}
