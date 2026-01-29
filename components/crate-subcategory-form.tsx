"use client";

import {
  createSubCategoryAction,
  updateSubCategoryAction,
} from "@/actions/action.category";
import { Loader2 } from "lucide-react";
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
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return toast.error("মেইন ক্যাটেগরি সিলেক্ট করুন");

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
      toast.error("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mt-4 border rounded-md space-y-4"
    >
      <div>
        <label className="block text-sm font-bold text-[#003366] mb-1">
          সাব-ক্যাটেগরি নাম
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="সাব-ক্যাটেগরির নাম লিখুন"
          className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-[#003366]"
          required
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setIsCreating(false)}
          type="button"
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 font-bold hover:bg-gray-50"
        >
          বাতিল
        </button>
        <button
          disabled={loading}
          className="flex-1 bg-[#003366] text-white py-2 font-bold flex justify-center items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {initialData ? "আপডেট করুন" : "সেভ করুন"}
        </button>
      </div>
    </form>
  );
}
