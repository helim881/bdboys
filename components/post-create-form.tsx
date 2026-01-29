"use client";

import { createPostAction } from "@/actions/action.post";
import { Loader2, Save, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

const CreatePost = ({
  categoryId,
  subCategoryId,
  setIsCreating,
}: {
  categoryId: string;
  subCategoryId: string;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId,
    subCategoryId,
    featuredImage: null as string | null,
  });

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

    if (!formData.title || !formData.content || !formData.categoryId) {
      return toast.error("সকল ফিল্ড পূরণ করুন");
    }

    if (!session?.data?.user?.id) {
      return toast.error("প্রথমে লগইন করুন");
    }

    // 🔹 Set status based on user role
    const userRole = session?.data?.user?.role; // assuming `role` exists in session
    const status =
      userRole === "ADMIN" || userRole === "AUTHOR" ? "PUBLISHED" : "PENDING";

    setIsSubmitting(true);
    const result = await createPostAction(
      { ...formData, status },
      session?.data?.user?.id,
    );
    setIsSubmitting(false);

    if (result.success) {
      setFormData({
        title: "",
        content: "",
        categoryId,
        subCategoryId,
        featuredImage: null,
      });
      toast.success(
        status === "PUBLISHED"
          ? "পোস্ট সফলভাবে প্রকাশ হয়েছে!"
          : "পোস্ট জমা হয়েছে, অনুমোদনের জন্য অপেক্ষা করুন",
      );
      setIsCreating(false);
    } else {
      toast.error("ত্রুটি: " + result.error);
    }
  };

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
        />
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
