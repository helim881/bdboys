import Link from "next/link";
import SmsCard from "./sms-card";

export default function SmsSection({ cat }: { cat: any }) {
  return (
    <section className="mb-6 bg-white border border-[#B8D1E5] rounded-sm shadow-sm">
      {/* Header Bar */}
      <div className="bg-[#E9F1F7] px-3 py-1.5 flex justify-between items-center border-b border-[#B8D1E5]">
        <h2 className="text-sm font-bold text-[#333]">{cat.name}</h2>
        <Link
          href={`/sms/${cat.slug}`}
          className="text-[11px] font-bold text-red-800 hover:underline"
        >
          আরও
        </Link>
      </div>

      {/* Content Area */}
      <div className="px-4">
        {cat.sms.map((sms: any) => (
          <SmsCard key={sms.id} sms={sms} />
        ))}
      </div>

      {/* Bottom Link (Optional, seen in "Popular SMS" section) */}
      <div className="bg-gray-50 text-right px-3 py-1 border-t border-gray-100">
        <Link
          href={`/sms/category/${cat.slug}`}
          className="text-[10px] text-gray-500 hover:underline"
        >
          More
        </Link>
      </div>
    </section>
  );
}
