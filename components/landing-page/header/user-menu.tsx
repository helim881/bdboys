import { signOut } from "next-auth/react"; // Assuming NextAuth
import { useState } from "react";

export default function UserMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left text-gray-700">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-all focus:outline-none"
      >
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">
          {session?.user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium hidden sm:inline">
          {session?.user?.name}
        </span>
        {/* Simple Chevron Icon */}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 overflow-hidden">
            <div className="px-4 py-2 text-xs text-gray-500 border-b border-slate-100">
              Manage Account
            </div>

            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
