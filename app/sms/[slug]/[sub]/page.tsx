import Breadcrumb from "@/components/breadcumb";

import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import SmsCard from "../../components/sms-card";
import SmsSubmitForm from "./submit-from";

type Props = {
  params: Promise<{ slug: string; sub: string }>;
};

export default async function SubCategoryPage({ params }: Props) {
  const { slug, sub } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedSub = decodeURIComponent(sub);

  const subCategoryData = await prisma.subCategory.findUnique({
    where: { slug: decodedSub },
    include: {
      category: true,
      sms: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!subCategoryData || subCategoryData.category.slug !== decodedSlug) {
    notFound();
  }

  return (
    <main className="bg-gray-100 min-h-screen p-2 font-sans">
      <div className="  bg-white border border-gray-300 shadow-sm">
        {/* 1. Breadcrumb - Blue Links */}
        <div className="bg-white p-2 border-b border-gray-200 text-[13px] text-blue-900 font-medium">
          <Breadcrumb />
        </div>

        {/* 2. Submit Form Section */}
        <SmsSubmitForm
          categoryId={subCategoryData.categoryId}
          subCategoryId={subCategoryData.id}
        />

        {/* 3. SubCategory Title Header (Grey Bar) */}
        <div className="bg-[#eeeeee] py-1 border-b border-gray-300 text-center">
          <h1 className="text-[13px] font-bold text-gray-700">
            {subCategoryData.name}
          </h1>
        </div>

        {/* 4. SMS List */}
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
    </main>
  );
}
