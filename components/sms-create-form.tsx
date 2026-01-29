"use client";

import { createSmsAction } from "@/actions/action.sms";
import { Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

const CreateSms = ({
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
    content: "",
    categoryId,
    subCategoryId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content || !formData.categoryId) {
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
    const result = await createSmsAction({
      ...formData,
      status,
      authorId: session?.data?.user?.id,
    });
    setIsSubmitting(false);

    if (result.success) {
      setFormData({
        content: "",
        categoryId,
        subCategoryId,
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
      {/* Content */}
      <div>
        <label className="block text-sm font-bold text-[#003366] mb-2">
          এসএমএস কন্টেন্ট
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
          {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "এসএমএস প্রকাশ করুন"}
        </button>
      </div>
    </form>
  );
};

export default CreateSms;
