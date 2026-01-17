"use client";

import {
  ChevronRight,
  FilePlus,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      href: "/admin/category",
      label: "ক্যাটেগরি",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/subcategory",
      label: "সাব-ক্যাটেগরি",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/posts",
      label: "পোস্ট ম্যানেজমেন্ট",
      icon: LayoutDashboard,
    },
    { href: "/admin/posts/create", label: "নতুন পোস্ট তৈরি", icon: FilePlus },
    { href: "/admin/users", label: "ব্যবহারকারী", icon: Users },
    { href: "/admin/sms", label: "এসএমএস", icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] border-r border-slate-800">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-red-600/20">
            S
          </div>
          <span className="text-white font-bold tracking-tight text-lg">
            SMS <span className="text-slate-500 font-medium">Admin</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-red-600 text-white shadow-md shadow-red-900/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-white"
                  }
                />
                {item.label}
              </div>
              {isActive && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white font-bold text-sm">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          লগআউট
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
