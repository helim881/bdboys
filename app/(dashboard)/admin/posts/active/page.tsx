import PostCard from "@/components/landing-page/post-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Post } from "../../dashboard/types";

async function getPosts(page: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?page=${page}&limit=10`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { data: posts, totalPages } = await getPosts(currentPage);

  return (
    <div className="space-y-4">
      {/* Posts Grid */}
      <div className="grid grid-cols-1   gap-4">
        {posts &&
          posts?.length > 0 &&
          posts.map((post: Post) => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Pagination Controls */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${Math.max(1, currentPage - 1)}`}
              aria-disabled={currentPage <= 1}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* Simple Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`?page=${page}`}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              aria-disabled={currentPage >= totalPages}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
