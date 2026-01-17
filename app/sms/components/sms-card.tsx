// components/sms/SmsCard.tsx

interface SmsCardProps {
  content: string;
  categoryName: string;
  author: string;
  categoryLink: string;
}

export default function SmsCard({
  content,
  categoryName,
  author,
  categoryLink,
}: SmsCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert("SMS Copied!");
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      {/* SMS Body */}
      <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-gray-800 mb-2">
        {content}
      </pre>

      {/* Footer Meta */}
      <div className="text-[11px] text-gray-500">
        <span>In </span>
        <a href={categoryLink} className="text-[#003366] hover:underline">
          {categoryName}
        </a>
        <span className="mx-1">By</span>
        <span className="text-red-700 font-medium">{author}</span>
        <span className="mx-1">-</span>
        <button
          onClick={handleCopy}
          className="text-blue-700 font-bold hover:underline"
        >
          Copy This
        </button>
      </div>
    </div>
  );
}
