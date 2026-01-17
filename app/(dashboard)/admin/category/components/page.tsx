"use client";

import {
  createCategoryAction,
  updateCategoryAction,
} from "@/actions/action.category";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const CategoryModal = ({ onClose, onSuccess, initialData }: any) => {
  const [name, setName] = useState(initialData?.name || "");
  // Default type is POST, or initialData type if editing
  const [type, setType] = useState(initialData?.type || "POST");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = initialData
      ? await updateCategoryAction(initialData.id, { name, type })
      : await createCategoryAction(name, type);

    if (result.success) {
      toast.success(initialData ? "আপডেট হয়েছে" : "তৈরি হয়েছে");
      onSuccess();
      onClose();
    } else {
      toast.error("কিছু ভুল হয়েছে");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#B8D1E5] rounded-sm">
        <div className="flex justify-between items-center p-4 border-b border-[#B8D1E5]">
          <h2 className="font-bold text-[#003366]">
            {initialData ? "ক্যাটেগরি এডিট করুন" : "নতুন ক্যাটেগরি যোগ করুন"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-2">
              ক্যাটেগরি নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="যেমন: রাজনীতি, ভালোবাসা"
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#003366] outline-none text-sm"
            />
          </div>

          {/* Category Type Selection */}
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-2">
              ক্যাটেগরি ধরণ
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="POST"
                  checked={type === "POST"}
                  onChange={(e) => setType(e.target.value)}
                  className="accent-[#003366]"
                />
                <span className="text-sm">Post (ব্লগ)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="SMS"
                  checked={type === "SMS"}
                  onChange={(e) => setType(e.target.value)}
                  className="accent-[#003366]"
                />
                <span className="text-sm">SMS (এসএমএস)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#003366] text-white px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  সেভ হচ্ছে...
                </>
              ) : (
                "সেভ করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
