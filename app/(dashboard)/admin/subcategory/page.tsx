"use client";
import { deleteSubCategoryAction } from "@/actions/action.category";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SubCategoryModal from "./components/subcaegory-modal";

const SubCategoriesPage = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const fetchData = async () => {
    const [resSub, resCat] = await Promise.all([
      fetch("/api/subcategories"),
      fetch("/api/categories"),
    ]);
    setSubs(await resSub.json());
    setCategories(await resCat.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত?")) {
      const res = await deleteSubCategoryAction(id);
      if (res.success) {
        toast.success("ডিলিট হয়েছে");
        fetchData();
      }
    }
  };

  return (
    <div className="p-6 bg-white border border-[#B8D1E5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#003366]">
          সাব-ক্যাটেগরি লিস্ট
        </h1>
        <button
          onClick={() => {
            setSelectedSub(null);
            setIsModalOpen(true);
          }}
          className="bg-[#003366] text-white px-4 py-2 flex items-center gap-2"
        >
          <Plus size={18} /> নতুন সাব-ক্যাটেগরি
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-left">নাম</th>
            <th className="border p-2 text-left">মেইন ক্যাটেগরি</th>
            <th className="border p-2 text-center">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50">
              <td className="border p-2">{sub.name}</td>
              <td className="border p-2">{sub.category?.name}</td>
              <td className="border p-2 text-center flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedSub(sub);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <SubCategoryModal
          categories={categories}
          initialData={selectedSub}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default SubCategoriesPage;
