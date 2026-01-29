"use client";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import SubcategoryWithPost from "../components/subcategoryWithPost";

export default function SubcategoryListClient({
  initialData,
  slug,
}: {
  initialData: any;
  slug: string;
}) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async (nextPage: number) => {
    setLoading(true);
    const res = await fetch(`/api/categories/${slug}?page=${nextPage}`);
    const result = await res.json();
    if (result.success) {
      setData(result.data);
      setPage(nextPage);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        data.subCategories.map((sub: any) => (
          <SubcategoryWithPost key={sub.id} category={sub} slug={slug} />
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1 || loading}
          onClick={() => loadMore(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page >= initialData.totalPages || loading}
          onClick={() => loadMore(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
