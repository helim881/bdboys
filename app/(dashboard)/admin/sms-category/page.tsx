"use client";

import { deleteCategoryAction } from "@/actions/action.category";
import Breadcrumb from "@/components/breadcumb";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryModal from "./components/page";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=SMS");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("ক্যাটেগরি লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ক্যাটেগরি মুছে ফেলতে চান?")) return;
    try {
      const result = await deleteCategoryAction(id);
      if (result.success) {
        toast.success("মুছে ফেলা হয়েছে");
        fetchCategories();
      }
    } catch (err) {
      toast.error("কিছু ভুল হয়েছে");
    }
  };

  const handleEdit = (cat: any) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="container   font-sans">
      <Breadcrumb />
      {/* Header Section */}
      <div className="bg-[#A13E34] text-white px-3 py-1 flex justify-between items-center">
        <h2 className="text-lg font-bold">রিভিউ সমগ্র</h2>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-[#E4584B] border border-white/20 px-2 py-0.5 text-sm hover:bg-[#c94d42] transition-colors"
        >
          Create Category
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-[#F9F9F9]">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="border-b border-gray-200 p-3 last:border-b-0"
          >
            <div className="flex items-start gap-1">
              <span className="text-gray-600 mt-1">›</span>
              <Link
                href={`/admin/sms-category/${cat?.id}`}
                className="text-[#3366BB] text-xl cursor-pointer hover:underline"
              >
                {cat.name}
              </Link>
            </div>
            <div className="flex gap-2 text-xs text-[#3366BB] mt-1 ml-4">
              <button
                onClick={() => handleEdit(cat)}
                className="hover:underline"
              >
                Edit
              </button>
              <span className="text-gray-400">|</span>

              <button
                onClick={() => handleDelete(cat.id)}
                className="hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Integration */}
      {isModalOpen && (
        <CategoryModal
          initialData={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
