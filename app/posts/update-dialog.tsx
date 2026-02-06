"use client";

import { updatePostAction } from "@/actions/action.post";
import DOMPurify from "isomorphic-dompurify";
import { Loader2, Save, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import toast from "react-hot-toast";

import "react-quill/dist/quill.snow.css";

// Dynamic import of ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full bg-gray-50 animate-pulse border" />
  ),
});

type UpdatePostModalProps = {
  post: {
    id: string;
    title: string;
    content: string;
    featuredImage: string | null;
    categoryId: string;
    subCategoryId: string;
  };

  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdatePostModal = ({ post, setOpen }: UpdatePostModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    categoryId: post.categoryId,
    subCategoryId: post.subCategoryId,
    featuredImage: post.featuredImage,
  });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    [],
  );

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
      return toast.error("শিরোনাম এবং কন্টেন্ট আবশ্যিক");
    }

    if (!session?.user?.id) {
      return toast.error("প্রথমে লগইন করুন");
    }

    const sanitizedContent = DOMPurify.sanitize(formData.content);

    setIsSubmitting(true);
    try {
      const result = await updatePostAction(post.id, {
        ...formData,
        content: sanitizedContent,
      });

      if (result.success) {
        toast.success("পোস্ট সফলভাবে আপডেট হয়েছে!");
        setOpen(false);
      } else {
        toast.error(result.error || "কিছু ভুল হয়েছে");
      }
    } catch (error) {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-4 md:p-8 border border-[#B8D1E5] shadow-sm rounded-md"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-[#003366]">পোস্ট আপডেট করুন</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-red-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#003366]">
          পোস্ট শিরোনাম
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="এখানে শিরোনাম লিখুন..."
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#003366] outline-none transition-all"
        />
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#003366]">ফিচার্ড ইমেজ</label>
        <div className="flex items-start gap-6">
          <label className="group relative w-full md:w-64 h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#003366] hover:bg-slate-50 transition-all overflow-hidden">
            {formData.featuredImage ? (
              <img
                src={formData.featuredImage}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-gray-400 group-hover:text-[#003366]" />
                <span className="text-xs text-gray-500 mt-2 block">
                  ছবি আপলোড করুন
                </span>
              </div>
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

      {/* Content Editor */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#003366]">
          পোস্ট কন্টেন্ট
        </label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          modules={modules}
          className="h-80 mb-16 md:mb-12"
          placeholder="আপনার বিস্তারিত তথ্য এখানে লিখুন..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#003366] hover:bg-[#002244] text-white px-10 py-3 rounded-md font-bold flex items-center gap-2 transition-all shadow-md disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {isSubmitting ? "প্রসেসিং..." : "পোস্ট আপডেট করুন"}
        </button>
      </div>
    </form>
  );
};

export default UpdatePostModal;
