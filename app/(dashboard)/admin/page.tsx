"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminStats = {
  pendingPosts: number;
  activePosts: number;
  categoryCount: number;
  pendingSms: number;
  activeSms: number;
  smsCategoryCount: number;
  userCount: number;
};

const AdminPanel = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        setStats(json.data);
      } catch (error) {
        console.error("ADMIN_STATS_FETCH_ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminItems = [
    {
      title: `Pending Posts (${stats?.pendingPosts ?? 0})`,
      href: "/admin/pending-post",
      desc: `Here's your pending posts list. Currently you have ${stats?.pendingPosts ?? 0} post.`,
    },
    {
      title: `Active Posts (${stats?.activePosts ?? 0})`,
      href: "/admin/active-post",
      desc: `Here's your active posts list. Currently you have ${stats?.activePosts ?? 0} post.`,
    },
    {
      title: `Category Management (${stats?.categoryCount ?? 0})`,
      href: "/admin/category",
      desc: `Manage your categories. Total categories: ${stats?.categoryCount ?? 0}.`,
    },
    {
      title: `Pending Sms (${stats?.pendingSms ?? 0})`,
      href: "/admin/pending-sms",
      desc: `Pending SMS count: ${stats?.pendingSms ?? 0}.`,
    },
    {
      title: `Active Sms (${stats?.activeSms ?? 0})`,
      href: "/admin/active-sms",
      desc: `Active SMS count: ${stats?.activeSms ?? 0}.`,
    },
    {
      title: `Sms Category Management (${stats?.smsCategoryCount ?? 0})`,
      href: "/admin/sms-category",
      desc: `Total SMS categories: ${stats?.smsCategoryCount ?? 0}.`,
    },
    {
      title: `User Management (${stats?.userCount ?? 0})`,
      href: "/admin/users",
      desc: `Total users: ${stats?.userCount ?? 0}.`,
    },
    {
      title: "Ads Management",
      href: "/admin/ads-manager",
      desc: "Manage your ads from here.",
    },
    {
      title: "System Management",
      href: "/admin/settings",
      desc: "Manage site default system settings.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans text-sm">
      {/* Header */}
      <div className="bg-[#f5f5f5] border-y border-gray-300 px-3 py-1.5 font-bold text-[#333]">
        Admin Panel
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-3 py-4 text-gray-500 text-xs">
          Loading admin statistics...
        </div>
      )}

      {/* Admin Links */}
      {!loading && (
        <div className="flex flex-col">
          {adminItems.map((item, index) => (
            <div
              key={index}
              className="px-3 py-2 border-b border-gray-100 last:border-b-gray-300"
            >
              <Link
                href={item.href}
                className="text-[#337ab7] font-semibold text-[14px] hover:text-[#23527c] hover:underline block w-fit"
              >
                {item.title}
              </Link>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
