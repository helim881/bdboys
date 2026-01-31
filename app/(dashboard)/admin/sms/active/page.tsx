"use client";

import Breadcrumb from "@/components/breadcumb";
import { ChevronLeft, ChevronRight, Eye, Filter, User } from "lucide-react";
import { useEffect, useState } from "react";

// 1. Updated Type to include Author
type SmsMessage = {
  id: string;
  title: string | null;
  content: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  category: { name: string };
  author: {
    name: string | null;
    email: string | null;
  };
};

type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function SmsPage() {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("PUBLISHED"); // Default to empty for "All"
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = `/api/all-sms?page=${page}&limit=8${statusFilter ? `&status=${statusFilter}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      setMessages(json.data);
      setPagination(json.pagination);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Breadcrumb />
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SMS Library</h1>
            <p className="text-gray-500">Manage messages and monitor authors</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-gray-300"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                value={statusFilter}
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
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
                    Message
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Author
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
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td
                            colSpan={5}
                            className="px-6 py-4 h-16 bg-gray-50/50"
                          ></td>
                        </tr>
                      ))
                  : messages.map((sms) => (
                      <tr
                        key={sms.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        {/* Message Content */}
                        <td className="px-6 py-4">
                          <div className="max-w-[240px]">
                            <div className="font-medium text-gray-900 truncate">
                              {sms.title || "Untitled Message"}
                            </div>
                            <div className="text-sm text-gray-500 truncate italic">
                              "{sms.content.slice(0, 40)}..."
                            </div>
                          </div>
                        </td>

                        {/* Author Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                              {sms.author.name?.charAt(0) || (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {sms.author.name || "Unknown"}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {new Date(sms.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded">
                            {sms.category.name}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              sms.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {sms.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-400 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(page - 1) * (pagination?.limit || 0) + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  page * (pagination?.limit || 0),
                  pagination?.total || 0,
                )}
              </span>{" "}
              of <span className="font-medium">{pagination?.total}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 px-3 text-sm font-semibold text-gray-700">
                <span>{page}</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-400">{pagination?.totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination?.totalPages || 1, p + 1))
                }
                disabled={page === pagination?.totalPages}
                className="p-2 text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
