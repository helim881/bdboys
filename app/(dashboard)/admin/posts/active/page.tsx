import { PostWithRelations } from "@/interface/type";
import PostClientComponents from "./components/client-components";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** * Defining the shape of your specific API response
 * since it does NOT use a .data wrapper
 */
interface PostsApiResponse {
  posts: PostWithRelations[];
  meta: {
    page: number;
    lastPage: number;
    total: number;
  };
  success?: boolean; // Optional, if your API returns a success flag
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;

  let posts: PostWithRelations[] = [];
  let meta = { page: 1, lastPage: 1, total: 0 };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?page=${currentPage}&limit=${limit}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch posts");

    // We cast the response to our Flat Interface
    const result: PostsApiResponse = await res.json();

    // Access directly from result since there is no .data wrapper
    posts = result.posts || [];
    meta = result.meta || meta;
  } catch (error) {
    console.error("POST_FETCH_ERROR:", error);
    // This will trigger your error.tsx file
    throw error;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Passing clean, validated data to the Client Component */}
      <PostClientComponents posts={posts} meta={meta} />
    </div>
  );
}
