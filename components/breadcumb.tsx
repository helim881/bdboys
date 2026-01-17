// components/common/Breadcrumb.tsx
"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split path into segments and remove empty strings
  const pathSegments = pathname.split("/").filter((item) => item !== "");

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-xs font-medium text-gray-500">
        {/* Home Link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-[#003366] transition-colors"
          >
            <Home size={14} className="mr-1" />
            <span>Home</span>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          // Capitalize first letter of the segment
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);

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
