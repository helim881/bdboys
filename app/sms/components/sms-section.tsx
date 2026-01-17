import SmsCard from "./sms-card";

interface SmsSectionProps {
  title: string;
  viewMoreLink: string;
  smsList: any[];
}

export default function SmsSection({
  title,
  viewMoreLink,
  smsList,
}: SmsSectionProps) {
  return (
    <section className="mb-6 bg-white border border-[#B8D1E5] rounded-sm shadow-sm">
      {/* Header Bar */}
      <div className="bg-[#E9F1F7] px-3 py-1.5 flex justify-between items-center border-b border-[#B8D1E5]">
        <h2 className="text-sm font-bold text-[#333]">{title}</h2>
        <a
          href={viewMoreLink}
          className="text-[11px] font-bold text-red-800 hover:underline"
        >
          আরও {title}
        </a>
      </div>

      {/* Content Area */}
      <div className="px-4">
        {smsList.map((sms) => (
          <SmsCard
            key={sms.id}
            content={sms.content}
            categoryName={sms.category}
            author={sms.author}
            categoryLink={`/category/${sms.categorySlug}`}
          />
        ))}
      </div>

      {/* Bottom Link (Optional, seen in "Popular SMS" section) */}
      <div className="bg-gray-50 text-right px-3 py-1 border-t border-gray-100">
        <a
          href={viewMoreLink}
          className="text-[10px] text-gray-500 hover:underline"
        >
          More {title}
        </a>
      </div>
    </section>
  );
}
