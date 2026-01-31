"use client";

import { movePostAction } from "@/actions/action.post";
import { Button } from "@/components/ui/button";
import { CategoryWithSubCategories } from "@/interface/type";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function MovedForm({
  post,
  onComplete,
  setIsCreating,
}: {
  post: any | null | undefined;
  onComplete?: () => void;
  setIsCreating: any;
}) {
  const [categories, setCategories] = useState<CategoryWithSubCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubId, setSelectedSubId] = useState<string>(
    post?.subCategoryId || "",
  );
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "error" | "success";
    msg?: string;
  }>({ type: "idle" });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Could not fetch categories");
        const data = await res.json();
        // Ensure data is an array before setting state
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setStatus({
          type: "error",
          msg: "Failed to load categories. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleMove = async () => {
    // 1. Guard clauses for missing data
    if (!post?.id) {
      setStatus({ type: "error", msg: "Invalid post data." });
      return;
    }
    if (!selectedSubId) {
      setStatus({ type: "error", msg: "Please select a sub-category." });
      return;
    }

    // 2. Find parent category ID safely
    const category = categories.find((cat) =>
      cat.subCategories?.some((sub) => sub.id === selectedSubId),
    );

    if (!category) {
      setStatus({ type: "error", msg: "Selected category not found." });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const result = await movePostAction({
        postId: post.id,
        categoryId: category.id,
        subCategoryId: selectedSubId,
      });

      if (result.success) {
        setStatus({
          type: "success",
          msg: result.message || "Moved successfully!",
        });

        // 3. Close the modal after a short delay so user sees the success state
        if (onComplete) {
          setTimeout(() => {
            onComplete();
            setIsCreating(false);
          }, 1200);
        }
      } else {
        setStatus({
          type: "error",
          msg: result.message || "Failed to move post.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", msg: "A network error occurred." });
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-blue-600" />
        <span className="text-xs text-gray-500">Loading Categories...</span>
      </div>
    );

  // Error state if post is missing
  if (!post)
    return (
      <div className="p-6 text-red-500 text-center">No post selected.</div>
    );

  return (
    <div className="space-y-5">
      {/* Post Identity Card - Using Optional Chaining everywhere */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-14 h-14 rounded overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={post?.image || "/placeholder.jpg"}
            className="w-full h-full object-cover"
            alt="thumbnail"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold truncate text-gray-800">
            {post?.title || "Untitled Post"}
          </h4>
          <p className="text-xs text-blue-600 font-medium">
            Currently: {post?.category?.name || "No Category"} &raquo;{" "}
            {post?.subCategory?.name || "No Sub"}
          </p>
        </div>
      </div>

      {status.type === "error" && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 border border-red-100 animate-in fade-in">
          <AlertCircle className="h-4 w-4" /> {status.msg}
        </div>
      )}

      {status.type === "success" && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm flex items-center gap-2 border border-green-100 animate-in fade-in">
          <Check className="h-4 w-4" /> {status.msg}
        </div>
      )}

      {/* HTML Native Select Option */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">
          Relocate To
        </label>

        <select
          value={selectedSubId}
          onChange={(e) => setSelectedSubId(e.target.value)}
          disabled={status.type === "loading" || status.type === "success"}
          className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1rem",
          }}
        >
          <option value="">-- Choose Sub-category --</option>
          {categories?.map((cat) => (
            <optgroup
              key={cat.id}
              label={cat.name?.toUpperCase() || "UNCATEGORIZED"}
            >
              {cat.subCategories?.map((sub) => (
                <option key={sub?.id} value={sub?.id}>
                  {sub?.name}{" "}
                  {sub?.id === post?.subCategoryId ? "(Current)" : ""}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <Button
        className="w-full h-12 font-bold bg-[#337ab7] hover:bg-blue-700 transition-all active:scale-95"
        disabled={
          !selectedSubId ||
          status.type === "loading" ||
          status.type === "success" ||
          selectedSubId === post.subCategoryId
        }
        onClick={handleMove}
      >
        {status.type === "loading" ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : status.type === "success" ? (
          <Check className="h-5 w-5" />
        ) : (
          "Update Location"
        )}
      </Button>
    </div>
  );
}
