"use client";

import Breadcrumb from "@/components/breadcumb";
import {
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Globe,
  Layout,
  List,
  Loader2,
  Megaphone,
  Type,
  XCircle,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdEditModal } from "./modal";

const PLACEMENTS = [
  {
    id: "header_ad",
    name: "Header Ad",
    desc: "After Header Content",
    icon: Layout,
    color: "text-blue-500",
  },
  {
    id: "footer_ad",
    name: "Footer Ad",
    desc: "Before Footer Content",
    icon: Globe,
    color: "text-emerald-500",
  },
  {
    id: "list_ad",
    name: "Category/List Ad",
    desc: "Inside Lists",
    icon: List,
    color: "text-purple-500",
  },
  {
    id: "recent_post_ad",
    name: "Before Recent Post",
    desc: "Sidebar/Home",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    id: "on_article_ad",
    name: "Ad On Articles",
    desc: "Inside Post Body",
    icon: FileText,
    color: "text-rose-500",
  },
  {
    id: "after_article_ad",
    name: "Ad After Articles",
    desc: "Below Content",
    icon: Type,
    color: "text-indigo-500",
  },
  {
    id: "youtube_ad",
    name: "Ad On Youtube Page",
    desc: "Youtube Section",
    icon: Youtube,
    color: "text-red-600",
  },
];

const ManageAds = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAd, setEditAd] = useState<any | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      setAds(data);
    } catch (err) {
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 space-y-6">
      <Breadcrumb />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              বিজ্ঞাপন ব্যবস্থাপনা
            </h1>
            <p className="text-sm text-slate-500">
              আপনার সাইটের সকল অ্যাড ইউনিট এখানে পরিচালনা করুন
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  প্লেসমেন্ট নাম
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  আইডি
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : (
                PLACEMENTS.map((place) => {
                  const dbAd = ads.find((a) => a.placement === place.id);
                  return (
                    <tr
                      key={place.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors`}
                          >
                            <place.icon className={`w-5 h-5 ${place.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {place.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {place.desc}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                          {place.id}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            dbAd?.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-400"
                          }`}
                        >
                          {dbAd?.isActive ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {dbAd?.isActive ? "Active" : "Disabled"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setEditAd({
                              ...dbAd,
                              placement: place.id,
                              name: place.name,
                            })
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Edit3 size={14} /> এডিট
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editAd && (
        <AdEditModal
          ad={editAd}
          isOpen={!!editAd}
          onClose={() => setEditAd(null)}
          onSuccess={fetchAds}
        />
      )}
    </div>
  );
};

export default ManageAds;
