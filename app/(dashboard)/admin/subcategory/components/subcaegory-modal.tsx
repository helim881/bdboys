"use client";

import {
  createSubCategoryAction,
  updateSubCategoryAction,
} from "@/actions/action.category";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SubCategoryModal = ({ onClose, onSuccess, initialData }: any) => {
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || ""); // FIX: Added missing state
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true); // Added for initial load

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("ক্যাটেগরি লোড করতে ব্যর্থ");
    } finally {
      setFetchingCats(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        onSuccess();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-xl border border-[#B8D1E5]">
        <div className="flex justify-between items-center p-4 border-b border-[#B8D1E5]">
          <h2 className="font-bold text-[#003366]">
            {initialData ? "এডিট" : "নতুন"} সাব-ক্যাটেগরি
          </h2>
          <button
            onClick={onClose}
            className="hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#003366] mb-1">
              মেইন ক্যাটেগরি
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-[#003366]"
              required
              disabled={fetchingCats}
            >
              <option value="">
                {fetchingCats ? "লোড হচ্ছে..." : "সিলেক্ট করুন"}
              </option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

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
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 font-bold hover:bg-gray-50"
            >
              বাতিল
            </button>
            <button
              disabled={loading || fetchingCats}
              className="flex-1 bg-[#003366] text-white py-2 font-bold flex justify-center items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {initialData ? "আপডেট করুন" : "সেভ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryModal;
