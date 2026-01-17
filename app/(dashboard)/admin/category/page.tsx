"use client";

import { deleteCategoryAction } from "@/actions/action.category";
import { Edit, Plus, Trash2 } from "lucide-react";
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
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("ক্যাটেগরি লোড করতে সমস্যা হয়েছে");
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
      const result = await deleteCategoryAction(id); // অ্যাকশন ইমপোর্ট করে নিন
      if (result.success) {
        toast.success("মুছে ফেলা হয়েছে");
        fetchCategories(); // লিস্ট রিফ্রেশ
      }
    } catch (err) {
      toast.error("কিছু ভুল হয়েছে");
    }
  };
  const handleEdit = (cat: any) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };
  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="p-6 bg-white border border-[#B8D1E5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#003366]">ক্যাটেগরি লিস্ট</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#003366] text-white px-4 py-2 flex items-center gap-2 hover:bg-[#002244] transition-all"
        >
          <Plus size={18} /> নতুন ক্যাটেগরি
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">
                নাম
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                সাব-ক্যাটেগরি
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 font-medium">
                  {cat.name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {cat.subCategories?.length || 0} টি
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
