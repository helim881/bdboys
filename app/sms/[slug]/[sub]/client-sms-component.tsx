"use client";
import Breadcrumb from "@/components/breadcumb";

import CreateSms from "@/components/sms-create-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SmsCard from "../../components/sms-card";
export const dynamic = "force-dynamic";
type Sms = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  subCategoryId: string;
};
type SubCategory = {
  id: string;
  name: string;
  slug: string;
  sms: Sms[];
  categoryId: string;
};

export default function ClientCmsComponent({
  subCategoryData,
}: {
  subCategoryData: SubCategory;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);
  return (
    <main className="py-4">
      <Breadcrumb />

      <div className="  bg-white border border-gray-300 shadow-sm">
        {/* 1. Breadcrumb - Blue Links */}

        {/* 2. Submit Form Section */}

        {/* 3. SubCategory Title Header (Grey Bar) */}
        <div className="bg-[#EFEFEF] p-4 py-1.5 border-b border-gray-300 flex justify-between items-center">
          <h1 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
            {subCategoryData.name}
          </h1>
          {isLoggedIn && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-blue-700 font-semibold text-sm hover:underline"
            >
              {isCreating ? "Back to sms" : "Create sms"}
            </button>
          )}
        </div>

        {/* 4. SMS List */}
        {!isCreating ? (
          <div>
            <div className="bg-white">
              {subCategoryData.sms.length > 0 ? (
                subCategoryData.sms.map((item, index) => (
                  <SmsCard key={item.id} sms={item} index={index} />
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 italic text-sm">
                  No SMS found in this category.
                </div>
              )}
            </div>

            {/* 5. Footer Bar */}
            <div className="bg-[#eeeeee] py-1 text-center border-t border-gray-300">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-tight">
                End of {subCategoryData.name}
              </span>
            </div>
          </div>
        ) : (
          <CreateSms
            categoryId={subCategoryData?.categoryId}
            subCategoryId={subCategoryData?.id}
            setIsCreating={setIsCreating}
          />
        )}
      </div>
    </main>
  );
}
