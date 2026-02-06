"use client";

import { deleteSubCategoryAction } from "@/actions/action.category";
import Breadcrumb from "@/components/breadcumb";
import SubCategoryModal from "@/subcategory/components/subcaegory-modal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SubCategoriesPage = ({ params }: { params: { slug: string } }) => {
  const slug = decodeURIComponent(params.slug);

  const [subcategory, setsubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(`/api/subcategories/${slug}`);
      const data = await res.json();

      setsubcategories(data?.data);
    } catch (err) {
      toast.error("ক্যাটেগরি লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ক্যাটেগরি মুছে ফেলতে চান?")) return;
    try {
      const result = await deleteSubCategoryAction(id);
      if (result.success) {
        toast.success("মুছে ফেলা হয়েছে");
        fetchSubcategories();
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
    <div className="  font-sans">
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
          Create Sub Category
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-[#F9F9F9]">
        {subcategory?.map((cat) => (
          <div
            key={cat.id}
            className="border-b border-gray-200 p-3 last:border-b-0"
          >
            <div className="flex items-start gap-1">
              <span className="text-gray-600 mt-1">›</span>
              <h3 className="text-[#3366BB] text-xl cursor-pointer hover:underline">
                {cat.name}
              </h3>
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

      {/* Footer Section */}
      {/* <Link
        href={`/admin/category`}
        className="bg-[#E9E9E9] p-2 flex justify-between items-center border-t border-gray-300"
      >
        <span className="font-bold text-gray-700">Back To</span>
        <button className="bg-[#E4584B] text-white px-4 py-1 text-sm font-semibold">
          Categories
        </button>
      </Link> */}

      {/* Modal Integration */}
      {isModalOpen && (
        <SubCategoryModal
          type="SMS"
          initialData={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
            fetchSubcategories();
          }}
        />
      )}
    </div>
  );
};

export default SubCategoriesPage;
