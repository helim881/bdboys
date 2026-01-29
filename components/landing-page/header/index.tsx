"use client";

import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react"; // লুসাইড আইকন ব্যবহার করলে দেখতে ভালো লাগে
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header({
  logo,
  siteName,
}: {
  logo?: string | null;
  siteName?: string;
}) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  let role;
  const getDashboardUrl = () => {
    role = (session?.user?.role as keyof typeof routes) || "ADMIN";

    const routes = {
      USER: "/user/dashboard",
      AUTHOR: "/author/dashboard",
      ADMIN: "/admin/dashboard",
      EDITOR: "/editor/dashboard",
    };

    return routes[role] || "/";
  };

  return (
    <header className=" border   relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <div className="relative h-8 w-32">
              {" "}
              {/* Adjust width/height as needed */}
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

        <div className="flex items-center text-white gap-4">
          {status === "loading" ? (
            <div className="h-6 w-16 bg-white/10 animate-pulse rounded"></div>
          ) : session ? (
            <div className="relative text-gray-700">
              {/* ড্রপডাউন ট্রিগার বাটন */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md hover:bg-white/20 transition-all"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {session?.user?.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* ড্রপডাউন মেনু */}
              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">লগইন করা আছে</p>
                      <p className="text-sm font-bold truncate">
                        {session?.user?.email}
                      </p>
                    </div>

                    <Link
                      href={getDashboardUrl()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-blue-600" />
                      ড্যাশবোর্ড
                    </Link>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      লগআউট
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-white text-[#003366] px-5 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* নেভিগেশন বার */}
      <nav className="bg-[#333333] text-white border-t border-gray-600">
        <ul className="container mx-auto px-4 flex gap-6 text-[11px] py-2.5 uppercase font-medium">
          <li className="hover:text-blue-400 transition-colors">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-blue-400 transition-colors">
            <Link href="/sms">Sms Zone</Link>
          </li>
          <li className="hover:text-blue-400 transition-colors">
            <Link href="/posts">Recent Posts</Link>
          </li>
          {session?.user?.role === "ADMIN" && (
            <li className="hover:text-blue-400 transition-colors">
              <Link href="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
