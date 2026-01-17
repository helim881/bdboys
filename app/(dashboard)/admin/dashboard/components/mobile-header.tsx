"use client";

import { menuItems } from "@/config/menus";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileHeader = ({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Top Bar */}
      <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={onToggle}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={22} />
        </button>
        <span className="font-bold text-slate-900">Admin Panel</span>
      </header>

      {/* Slide-over Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onToggle}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[280px] bg-[#0f172a] shadow-2xl transition-transform duration-300 ease-out ${
            show ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <span className="text-white font-bold">Menu</span>
            <button onClick={onToggle} className="text-slate-400 p-1">
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onToggle}
                className={`block px-4 py-3 rounded-xl font-bold text-sm ${
                  pathname === item.href
                    ? "bg-red-600 text-white"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
