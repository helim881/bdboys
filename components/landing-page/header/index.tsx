"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <header className="bg-[#003366] text-white">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter">BDBOYS</h1>

        <div className="flex gap-2">
          {status === "loading" ? (
            <span className="text-xs opacity-50">Loading...</span>
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs hidden sm:inline">
                Hi, {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-3 py-0.5 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href={"/auth"}
              className="bg-white text-black px-3 py-0.5 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <nav className="bg-[#333333] border-t border-gray-600">
        <ul className="container mx-auto px-4 flex gap-6 text-xs py-2 uppercase">
          <li className="hover:text-blue-400 cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-blue-400 cursor-pointer">Sms Zone</li>
          <li className="hover:text-blue-400 cursor-pointer">Recent Posts</li>
        </ul>
      </nav>
    </header>
  );
}
