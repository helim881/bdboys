"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // ১. স্লাইস করার পর প্রতিটি সেগমেন্টকে decodeURIComponent দিয়ে ডিকোড করুন
  const pathSegments = pathname
    .split("/")
    .filter((item) => item !== "")
    .map((segment) => decodeURIComponent(segment));

  return (
    <nav aria-label="Breadcrumb" className=" border rounded-md my-2 p-4">
      <ol className="flex items-center space-x-2 text-xs font-medium text-gray-500">
        {/* Home Link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-[#003366] transition-colors"
          >
            <Home size={14} className="mr-1" />
            <span>Home</span> {/* আপনি চাইলে 'Home' ও রাখতে পারেন */}
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // ইউআরএল তৈরির সময় আবার এনকোড করার প্রয়োজন নেই কারণ ব্রাউজার এটি অটো করে নেয়,
          // তবে স্লাগগুলো সঠিক অর্ডারে জয়েন করতে হবে।
          const href = `/${pathSegments
            .slice(0, index + 1)
            .map((s) => encodeURIComponent(s)) // লিঙ্কের জন্য এনকোড করা নিরাপদ
            .join("/")}`;

          const isLast = index === pathSegments.length - 1;

          // ২. লেবেল ফরম্যাটিং: ইংরেজি হলে প্রথম অক্ষর বড় হাতের হবে, বাংলা হলে যা আছে তাই থাকবে
          const label = segment.match(/[a-zA-Z]/)
            ? segment.charAt(0).toUpperCase() + segment.slice(1)
            : segment;

          return (
            <li key={href} className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-400" />
              {isLast ? (
                <span className="text-[#003366] font-bold" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-[#003366] transition-colors hover:underline"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
