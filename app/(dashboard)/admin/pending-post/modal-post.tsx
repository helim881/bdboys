// modal-post.tsx
"use client";

import { updateStatusAction } from "@/actions/action.post";
import { Archive, CheckCircle2, FileText, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type PostStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

interface StatusModalProps {
  post: {
    id: string;
    title: string | null;
    status: PostStatus;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const StatusModal = ({ post, onClose, onSuccess }: StatusModalProps) => {
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateStatusAction(post.id, status);
      if (result.success) {
        toast.success("স্ট্যাটাস আপডেট হয়েছে");
        onSuccess(); // Triggers re-fetch in parent
      } else {
        toast.error("আপডেট করা সম্ভব হয়নি");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    {
      id: "PUBLISHED",
      label: "Published",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      id: "PENDING",
      label: "PENDING",
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      id: "ARCHIVED",
      label: "Archived",
      icon: Archive,
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm shadow-xl rounded-xl overflow-hidden border border-gray-100 scale-in-95 animate-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-gray-800 text-lg">Update Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Updating:{" "}
              <span className="font-semibold text-gray-700">
                {post.title || "Untitled SMS"}
              </span>
            </p>

            <div className="space-y-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = status === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? `${option.bg} ${option.border} ring-2 ring-blue-500`
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      name="status"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setStatus(option.id as PostStatus)}
                    />
                    <Icon className={`h-5 w-5 ${option.color}`} />
                    <span
                      className={`font-medium ${isSelected ? option.color : "text-gray-600"}`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || status === post.status}
              className="flex-1 bg-gray-900 text-white px-4 py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-black disabled:bg-gray-300 rounded-lg transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusModal;
