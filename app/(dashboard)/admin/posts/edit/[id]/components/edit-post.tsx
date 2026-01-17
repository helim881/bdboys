"use client";

import { updatePostAction } from "@/actions/action.post";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const EditPost = ({ post }: { post: any }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    categoryId: post?.categoryId || "",
    subCategoryId: post?.subCategoryId || "",
    featuredImage: post?.image || null, // Adjusted to match your Prisma field 'image'
    status: post?.status || "DRAFT",
  });

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

  const availableSubCats = useMemo(() => {
    if (!formData.categoryId || categories.length === 0) return [];
    const cat = categories.find(
      (c) => String(c.id) === String(formData.categoryId),
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
    if (!formData.categoryId) return toast.error("ক্যাটেগরি সিলেক্ট করুন");

    setIsSubmitting(true);
    const result = await updatePostAction(post.id, formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("পোস্ট সফলভাবে আপডেট হয়েছে!");
      router.push("/admin/posts");
      router.refresh();
    } else {
      toast.error("ত্রুটি: " + result.error);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-[#B8D1E5] bg-white">
        <Loader2 className="animate-spin text-[#003366] mb-2" />
        <p className="text-sm text-gray-500">তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 border border-[#B8D1E5]"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#003366]">পোস্ট এডিট করুন</h2>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-500 flex items-center gap-1 text-sm hover:text-black"
        >
          <ArrowLeft size={16} /> ফিরে যান
        </button>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#003366] mb-2">
          পোস্ট শিরোনাম
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 focus:outline-[#003366] text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
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
                subCategoryId: "",
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

        {/* SubCategory */}
        <div>
          <label className="block text-sm font-bold text-[#003366] mb-2">
            সাবক্যাটেগরি
          </label>
          <select
            value={formData.subCategoryId}
            onChange={(e) =>
              setFormData({ ...formData, subCategoryId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-sm disabled:bg-gray-100 focus:ring-1 focus:ring-[#003366] outline-none"
            disabled={!formData.categoryId || availableSubCats.length === 0}
          >
            <option value="">সাবক্যাটেগরি সিলেক্ট করুন</option>
            {availableSubCats.map((sub: any) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-bold text-[#003366] mb-2">
            স্ট্যাটাস
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-[#003366] outline-none font-medium"
          >
            <option value="DRAFT">Draft (খসড়া)</option>
            <option value="PUBLISHED">Published (প্রকাশিত)</option>
            <option value="ARCHIVED">Archived (আর্কাইভ)</option>
          </select>
        </div>
      </div>

      {/* Image Preview & Upload */}
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
          {formData.featuredImage && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, featuredImage: null })}
              className="text-red-500 text-xs font-bold hover:underline"
            >
              রিমুভ করুন
            </button>
          )}
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
          className="w-full px-4 py-3 border border-gray-300 focus:outline-[#003366] text-sm"
        ></textarea>
      </div>

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
          {isSubmitting ? "আপডেট হচ্ছে..." : "আপডেট সেভ করুন"}
        </button>
      </div>
    </form>
  );
};

export default EditPost;
