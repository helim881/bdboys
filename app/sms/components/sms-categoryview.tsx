import SmsCard from "./sms-card";

interface SubCategory {
  id: string;
  name: string;
  count: number;
}

interface CategoryPageProps {
  categoryName: string;
  topSms: any[];
  subCategories: SubCategory[];
}

export default function SmsCategoryView({
  categoryName,
  topSms,
  subCategories,
}: CategoryPageProps) {
  return (
    <div className="max-w-6xl mx-auto bg-white border border-[#B8D1E5] rounded-sm shadow-sm overflow-hidden">
      {/* 1. Category Title Header */}
      <div className="bg-[#E9F1F7] py-2 text-center border-b border-[#B8D1E5]">
        <h1 className="text-[#333] font-bold text-base">{categoryName}</h1>
      </div>

      {/* 2. Top Featured SMS in this Category */}
      <div className="px-4 py-2 divide-y divide-gray-100">
        {topSms.map((sms) => (
          <SmsCard
            key={sms.id}
            content={sms.content}
            categoryName={categoryName}
            author={sms.author}
            categoryLink="#"
          />
        ))}
      </div>

      {/* 3. Sub-Category List Header */}
      <div className="bg-[#E9F1F7] py-1 text-center border-y border-[#B8D1E5]">
        <h2 className="text-[#333] font-bold text-sm">
          {categoryName} Category
        </h2>
      </div>

      {/* 4. Sub-Category List (Matching image_198cfe.png) */}
      <div className="bg-white">
        {subCategories.map((sub, index) => (
          <a
            key={sub.id}
            href={`/category/sub/${sub.id}`}
            className={`block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:underline border-b border-gray-100 last:border-0`}
          >
            <span className="text-gray-400 mr-2">›</span>
            {sub.name}
            <span className="text-gray-500 ml-1 text-xs">({sub.count})</span>
          </a>
        ))}
      </div>
    </div>
  );
}
