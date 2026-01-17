"use client";

import { createPostAction } from "@/actions/action.post";
import { Loader2, Save, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    subCategoryId: "",
    featuredImage: null as string | null,
    status: "DRAFT",
  });

  // 1. Fetch Categories
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. FIX: Memoized subcategory filtering
  // This ensures subcategories update ONLY when categoryId or categories list changes
  const availableSubCats = useMemo(() => {
    if (!formData.categoryId || categories.length === 0) return [];
    const cat = categories.find(
      (c) => String(c.id) === String(formData.categoryId)
    );
    return cat?.subCategories || [];
  }, [formData.categoryId, categories]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          featuredImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !session?.data?.user?.id)
      return toast.error("ক্যাটেগরি সিলেক্ট করুন");

    setIsSubmitting(true);
    const result = await createPostAction(formData, session?.data?.user?.id);
    setIsSubmitting(false);

    if (result.success) {
      setFormData({
        title: "",
        content: "",
        categoryId: "",
        subCategoryId: "",
        featuredImage: null as string | null,
        status: "",
      });
      toast.success("পোস্ট সফলভাবে তৈরি হয়েছে!");
    } else {
      toast.error("ত্রুটি: " + result.error);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-[#B8D1E5] bg-white">
        <Loader2 className="animate-spin text-[#003366] mb-2" />
        <p className="text-sm text-gray-500">ক্যাটেগরি লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 border border-[#B8D1E5]"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-[#003366] mb-2">
          পোস্ট শিরোনাম
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="পোস্টের শিরোনাম লিখুন..."
          className="w-full px-4 py-2 border border-gray-300 focus:outline-[#003366] text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-bold text-[#003366] mb-2">
            ক্যাটেগরি
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoryId: e.target.value,
                subCategoryId: "", // Reset subcategory when parent changes
              })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-[#003366] outline-none"
          >
            <option value="">সিলেক্ট করুন</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* SubCategory Selection */}
        <div>
          <label className="block text-sm font-bold text-[#003366] mb-2">
            সাবক্যাটেগরি
          </label>
          <select
            value={formData.subCategoryId}
            onChange={(e) =>
              setFormData({ ...formData, subCategoryId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-1 focus:ring-[#003366] outline-none"
            disabled={!formData.categoryId || availableSubCats.length === 0}
          >
            {/* Logic for placeholder text */}
            {!formData.categoryId ? (
              <option value="">আগে ক্যাটেগরি সিলেক্ট করুন</option>
            ) : availableSubCats.length === 0 ? (
              <option value="">সাবক্যাটেগরি নেই</option>
            ) : (
              <>
                <option value="">সাবক্যাটেগরি সিলেক্ট করুন</option>
                {availableSubCats.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-bold text-[#003366] mb-2">
          ফিচার্ড ইমেজ
        </label>
        <div className="flex items-center gap-4">
          <label className="w-40 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative">
            {formData.featuredImage ? (
              <img
                src={formData.featuredImage}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <Upload className="text-gray-400" />
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          <div className="text-xs text-gray-400 space-y-1">
            <p>রেশিও: ১২০০x৬৩০ (JPG/PNG)</p>
            {formData.featuredImage && (
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, featuredImage: null })
                }
                className="text-red-500 hover:underline font-bold"
              >
                রিমুভ করুন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-bold text-[#003366] mb-2">
          পোস্ট কন্টেন্ট
        </label>
        <textarea
          rows={10}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
          placeholder="এখানে আপনার পোস্ট লিখুন..."
          className="w-full px-4 py-3 border border-gray-300 focus:outline-[#003366] text-sm"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#003366] text-white px-8 py-3 font-bold flex items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400 transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "পোস্ট প্রকাশ করুন"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
