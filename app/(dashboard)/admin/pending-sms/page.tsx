"use client";

import Breadcrumb from "@/components/breadcumb";
import { ChevronLeft, ChevronRight, Eye, FileText, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import StatusModal from "./modal-post";

// Updated Type to reflect a generic Post entity
type Post = {
  id: string;
  title: string | null;
  content: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  category: { name: string };
};

type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Tracks the specific Post being edited
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Added query parameters for page and status to the fetch call
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/all-sms?page=${page}&status=PENDING`,
        { cache: "no-store" },
      );

      const json = await res.json();
      // Ensure we handle the data structure based on your API response
      setPosts(json.data || []);
      setPagination(json.pagination || null);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Breadcrumb />
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Content Library
            </h1>
            <p className="text-gray-500">Manage and monitor your posts</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1); // Reset to first page on filter change
                }}
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Post Details
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td
                          colSpan={4}
                          className="px-6 py-4 h-16 bg-gray-50/50"
                        ></td>
                      </tr>
                    ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {post.title || "Untitled Post"}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {post.content}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            post.status === "PUBLISHED"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Eye className="h-5 w-5 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <div className="text-sm text-gray-500">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{pagination?.totalPages || 1}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= (pagination?.totalPages || 1) || loading}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering of the Modal */}
      {selectedPost && (
        <StatusModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSuccess={() => {
            fetchPosts(); // Refresh list on success
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}
