"use client";
import Breadcrumb from "@/components/breadcumb";
import CreateSubCategoryForm from "@/components/crate-subcategory-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SmsCard from "../components/sms-card";
import { Category } from "./page";

export default function SmsCategoryClientComponent({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);

  return (
    <>
      {!isCreating ? (
        <div className="  bg-white shadow-sm border border-gray-300 rounded-sm">
          {/* Breadcrumb Area */}
          <div className="p-2 text-sm text-[#003366] border-b border-gray-200 bg-white">
            <Breadcrumb />
          </div>

          {/* Main Header */}
          <div className="bg-[#EFEFEF] p-4 py-1.5 border-b border-gray-300 flex justify-between items-center">
            <h1 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
              {category.name}
            </h1>
            {isLoggedIn && (
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="text-blue-700 font-semibold text-sm hover:underline"
              >
                {isCreating ? "Back to Category" : "Create subcategory"}
              </button>
            )}
          </div>

          {/* SMS List Section */}
          <div className="divide-y divide-gray-200">
            {category?.sms?.length > 0 ? (
              category?.sms?.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <SmsCard sms={item} index={index} />
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-500 italic">
                No SMS available in this category.
              </div>
            )}
          </div>

          {/* Category Section Header */}
          <div className="bg-[#EFEFEF] py-1.5 border-t border-b border-gray-300 text-center mt-4">
            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
              {category.name} Category
            </h2>
          </div>

          {/* Sub-Category List (Matching the Screenshot Style) */}
          <div className="bg-white">
            {category.subCategories.length > 0 ? (
              <div className="grid grid-cols-1 divide-y divide-gray-100">
                {category?.subCategories?.map((sub) => (
                  <a
                    key={sub.id}
                    href={`/sms/${slug}/${sub.slug}`}
                    className="flex items-center p-3 text-[14px] text-[#003366] hover:bg-blue-50 transition-colors group"
                  >
                    <span className="mr-2 text-gray-400 group-hover:text-blue-600">
                      ›
                    </span>
                    <span className="font-medium hover:underline">
                      {sub.name}
                    </span>
                    <span className="ml-1 text-gray-600 font-normal">
                      ({sub?._count.sms})
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-4 text-xs text-gray-400 text-center">
                No sub-categories available.
              </div>
            )}
          </div>
        </div>
      ) : (
        <CreateSubCategoryForm
          categoryId={category?.id}
          setIsCreating={setIsCreating}
        />
      )}
    </>
  );
}
