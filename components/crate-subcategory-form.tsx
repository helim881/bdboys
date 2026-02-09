"use client";

import {
  createSubCategoryAction,
  updateSubCategoryAction,
} from "@/actions/action.category";
import { Loader2, Lock } from "lucide-react"; // Lock আইকন যোগ করা হয়েছে
import { useSession } from "next-auth/react"; // সেশন চেক করার জন্য
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function CreateSubCategoryForm({
  initialData,
  categoryId,
  setIsCreating,
}: {
  initialData?: any;
  categoryId: string;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const [name, setName] = useState(initialData?.name || ""); // Edit মুডে নাম অটোমেটিক পাওয়ার জন্য
  const [loading, setLoading] = useState(false);

  // রোল চেক করা হচ্ছে
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  // যদি অ্যাডমিন না হয়, তবে একটি ওয়ার্নিং মেসেজ দেখাবে
  if (!isAdmin) {
    return (
      <div className="p-6 mt-4 border border-red-100 bg-red-50 rounded-md text-center">
        <div className="flex justify-center mb-2 text-red-500">
          <Lock size={24} />
        </div>
        <p className="text-red-600 font-bold text-sm">
          আপনার এই কাজটি করার অনুমতি নেই।
        </p>
        <button
          onClick={() => setIsCreating(false)}
          className="mt-3 text-xs text-gray-500 underline"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return toast.error("মেইন ক্যাটেগরি সিলেক্ট করুন");
    if (!name.trim()) return toast.error("নাম প্রদান করুন");

    setLoading(true);
    try {
      const res = initialData
        ? await updateSubCategoryAction(initialData.id, name, categoryId)
        : await createSubCategoryAction(name, categoryId);

      if (res.success) {
        toast.success(initialData ? "আপডেট হয়েছে" : "তৈরি হয়েছে");
        setIsCreating(false);
      } else {
        toast.error(res.error || "কিছু ভুল হয়েছে");
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mt-4 border rounded-md space-y-4 bg-white shadow-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
        <h2 className="text-sm font-bold text-gray-700">
          {initialData ? "সাব-ক্যাটেগরি এডিট" : "নতুন সাব-ক্যাটেগরি যোগ"}
        </h2>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#003366] mb-1 uppercase tracking-wider">
          সাব-ক্যাটেগরি নাম
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="যেমন: রোমান্টিক এসএমএস"
          className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all"
          required
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setIsCreating(false)}
          type="button"
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 font-bold text-sm rounded hover:bg-gray-50 transition-colors"
        >
          বাতিল
        </button>
        <button
          disabled={loading}
          className="flex-1 bg-[#003366] text-white py-2 font-bold text-sm rounded flex justify-center items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400 transition-all shadow-md active:scale-95"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {initialData ? "আপডেট করুন" : "সেভ করুন"}
        </button>
      </div>
    </form>
  );
}
