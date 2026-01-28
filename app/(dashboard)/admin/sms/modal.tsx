"use client";

import { createSmsAction, updateSmsAction } from "@/actions/action.sms";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SmsModal = ({ onClose, onSuccess, initialData }: any) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // 1. টাইটেল স্টেট ইনিশিয়ালাইজেশন (initialData থাকলে সেটা নিবে)
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [subCategoryId, setSubCategoryId] = useState(
    initialData?.subCategoryId || "",
  );
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories?type=SMS")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const selectedCat = categories.find((c: any) => c.id === categoryId);
      setSubCategories(selectedCat?.subCategories || []);
    }
  }, [categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return toast.error("অনুগ্রহ করে লগইন করুন!");

    setLoading(true);

    // 2. পে-লোডে টাইটেল যুক্ত করা হলো
    const payload = {
      title,
      content,
      categoryId,
      subCategoryId: subCategoryId || undefined,
      authorId: currentUserId as string,
      status: status,
    };

    const res = initialData
      ? await updateSmsAction(initialData.id, payload)
      : await createSmsAction(payload);

    if (res.success) {
      toast.success(initialData ? "আপডেট হয়েছে" : "সফলভাবে তৈরি হয়েছে");
      onSuccess();
    } else {
      toast.error(res.error || "কিছু ভুল হয়েছে");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-6 border border-[#B8D1E5] rounded-sm shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="font-bold text-[#003366]">
            {initialData ? "এডিট" : "নতুন"} এসএমএস
          </h2>
          <button
            onClick={onClose}
            className="hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* স্ট্যাটাস সিলেক্টার */}
          <div>
            <label className="block text-xs font-bold text-[#003366] mb-1">
              স্ট্যাটাস *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 text-sm outline-[#003366] bg-gray-50"
              required
            >
              <option value="PUBLISHED">পাবলিশড (Live)</option>
              <option value="DRAFT">খসড়া (Draft)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#003366] mb-1">
                মেইন ক্যাটেগরি *
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubCategoryId("");
                }}
                className="w-full border p-2 text-sm outline-[#003366]"
                required
              >
                <option value="">সিলেক্ট করুন</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#003366] mb-1">
                সাব-ক্যাটেগরি
              </label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                className="w-full border p-2 text-sm outline-[#003366]"
                disabled={!categoryId}
              >
                <option value="">সিলেক্ট করুন</option>
                {subCategories.map((sc: any) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. টাইটেল ইনপুট ফিল্ড */}
          <div>
            <label className="block text-xs font-bold text-[#003366] mb-1">
              এসএমএস টাইটেল *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: শুভ সকাল মেসেজ"
              className="rounded-none border-gray-300 focus:border-[#003366]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#003366] mb-1">
              কন্টেন্ট *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 text-sm h-32 resize-none outline-[#003366] border-gray-300"
              placeholder="এখানে এসএমএস লিখুন..."
              required
            />
            <p className="text-[10px] text-gray-500 mt-1">
              ক্যারেক্টার সংখ্যা: {content.length}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 text-sm font-bold hover:bg-gray-50"
            >
              বাতিল
            </button>
            <button
              disabled={loading}
              className="flex-1 bg-[#003366] text-white py-2 font-bold flex justify-center items-center gap-2 hover:bg-[#002244] disabled:bg-gray-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
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

export default SmsModal;
