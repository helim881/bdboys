"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserMenu from "./user-menu";

export default function Header({
  logo,
  siteName,
}: {
  logo?: string | null;
  siteName?: string;
}) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [adCode, setAdCode] = useState("");

  useEffect(() => {
    // Fetching the Header Ad
    fetch(`/api/ads/header_ad`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "active") setAdCode(data.code);
      });
  }, []);

  return (
    <header className="relative border">
      {/* 1. TOP HEADER: Logo and User Profile */}
      <div className="container    py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <div className="relative h-8 w-32">
              <Image
                src={logo}
                alt={siteName || "Logo"}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          ) : (
            <span className="text-2xl font-bold tracking-tighter">
              {siteName || "BDBOYS"}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-6 w-16 bg-slate-100 animate-pulse rounded"></div>
          ) : session ? (
            <UserMenu session={session} />
          ) : (
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="bg-[#333333] text-white">
        <ul className="container mx-auto px-4 flex gap-6 text-[11px] py-2.5 uppercase font-medium overflow-x-auto whitespace-nowrap">
          <li className="hover:text-blue-400">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-blue-400">
            <Link href="/sms">Sms Zone</Link>
          </li>
          <li className="hover:text-blue-400">
            <Link href="/posts">Recent Posts</Link>
          </li>
          {session?.user?.role === "ADMIN" && (
            <li className="hover:text-blue-400">
              <Link href="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* 3. HEADER AD PLACEMENT: After Header Content */}
      {adCode && (
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <div
            className="w-full max-w-[728px] flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: adCode }}
          />
        </div>
      )}
    </header>
  );
}
