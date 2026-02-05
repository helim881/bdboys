"use client";
import Breadcrumb from "@/components/breadcumb";
import CreateSms from "@/components/sms-create-form";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Import Link for pagination
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

// Updated Props to include pagination meta
type ClientCmsComponentProps = {
  subCategoryData: SubCategory;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  basePath?: string;
};

export default function ClientCmsComponent({
  subCategoryData,
  meta,
  basePath,
}: ClientCmsComponentProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsLoggedIn(!!session?.data?.user);
  }, [session?.data?.user]);

  // Pagination helper variables
  const page = meta?.page || 1;
  const totalPages = meta?.totalPages || 1;
  console.log(meta);
  return (
    <main className="py-4">
      <Breadcrumb />

      <div className="bg-white border border-gray-300 shadow-sm">
        {/* SubCategory Title Header */}
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

        {/* Content Section */}
        {!isCreating ? (
          <div>
            <div className="bg-white">
              {subCategoryData.sms.length > 0 ? (
                <>
                  {subCategoryData.sms.map((item, index) => (
                    <SmsCard key={item.id} sms={item} index={index} />
                  ))}

                  {/* --- PAGINATION SECTION --- */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 py-4 bg-[#f9f9f9] border-t border-gray-200">
                      <Link
                        href={`${basePath}?page=${page - 1}`}
                        className={`px-3 py-1 text-xs font-bold border rounded uppercase transition ${
                          page <= 1
                            ? "bg-gray-100 text-gray-400 pointer-events-none border-gray-200"
                            : "bg-white text-blue-700 border-gray-300 hover:bg-blue-50"
                        }`}
                      >
                        « Prev
                      </Link>

                      <div className="text-[12px] font-bold text-gray-600 px-2 uppercase">
                        Page {page} of {totalPages}
                      </div>

                      <Link
                        href={`${basePath}?page=${page + 1}`}
                        className={`px-3 py-1 text-xs font-bold border rounded uppercase transition ${
                          page >= totalPages
                            ? "bg-gray-100 text-gray-400 pointer-events-none border-gray-200"
                            : "bg-white text-blue-700 border-gray-300 hover:bg-blue-50"
                        }`}
                      >
                        Next »
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-10 text-center text-gray-400 italic text-sm">
                  No SMS found in this category.
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="bg-[#eeeeee] py-1 text-center border-t border-gray-300">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-tight">
                {page < totalPages
                  ? `More on Page ${page + 1}`
                  : `End of ${subCategoryData.name}`}
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
