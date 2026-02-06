"use client";

import {
  createCategoryAction,
  updateCategoryAction,
} from "@/actions/action.category";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const SubCategoryModal = ({ onClose, onSuccess, initialData }: any) => {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "POST");

  // New State for SEO fields
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      type,
      metaTitle,
      tags,
      metaDescription,
    };

    const result = initialData
      ? await updateCategoryAction(initialData.id, payload)
      : await createCategoryAction(payload); // Ensure your server action accepts this object

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
      {/* Increased max-width to lg for better spacing with more inputs */}
      <div className="bg-white w-full max-w-lg shadow-2xl border border-[#B8D1E5] rounded-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#B8D1E5]">
          <h2 className="font-bold text-[#003366]">
            {initialData ? "ক্যাটেগরি এডিট করুন" : "নতুন ক্যাটেগরি যোগ করুন"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* 1. Category Name */}
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-1">
              ক্যাটেগরি নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="যেমন: রাজনীতি, ভালোবাসা"
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#003366] outline-none text-sm transition-all"
            />
          </div>

          {/* 2. Meta Title */}
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO ফ্রেন্ডলি শিরোনাম"
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#003366] outline-none text-sm transition-all"
            />
          </div>

          {/* 3. Tags */}
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-1">
              Tags (Separated With Comma)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="যেমন: রাজনীতি, নিউজ, ঢাকা"
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#003366] outline-none text-sm transition-all"
            />
          </div>

          {/* 4. Meta Description */}
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-1">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="ক্যাটেগরি সম্পর্কে সংক্ষিপ্ত বর্ণনা..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#003366] outline-none text-sm transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#003366] text-white px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400 rounded-sm transition-all shadow-md active:scale-95"
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

export default SubCategoryModal;
