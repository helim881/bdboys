"use client";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { deleteSmsAction } from "@/actions/action.sms";
import SmsModal from "./modal";

const SmsListPage = () => {
  const [smsList, setSmsList] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং পেজিনেশন স্টেট
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSms, setSelectedSms] = useState(null);

  const fetchSms = async () => {
    setLoading(true);
    try {
      // API থেকে ডাটা ফেচ (Pagination এবং Status সহ)
      const res = await fetch(
        `/api/sms?page=${page}&limit=10&status=${status} `,
      );
      const result = await res.json();

      setSmsList(result.data || []);
      setMeta(result.meta || {});
    } catch (err) {
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSms();
  }, [page, status]); // পেজ বা স্ট্যাটাস চেঞ্জ হলে অটো ফেচ হবে

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে মুছে ফেলতে চান?")) {
      const res = await deleteSmsAction(id);
      if (res.success) {
        toast.success("ডিলিট হয়েছে");
        fetchSms();
      }
    }
  };

  return (
    <div className="p-6 bg-white border border-[#B8D1E5] min-h-screen">
      {/* হেডার এবং ফিল্টার সেকশন */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#003366]">এসএমএস লিস্ট</h1>
          <p className="text-xs text-gray-500">
            মোট এসএমএস: {meta.total || 0} টি
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 p-2 text-sm outline-[#003366]"
          >
            <option value="ALL">সব স্ট্যাটাস</option>
            <option value="PUBLISHED">পাবলিশড</option>
            <option value="DRAFT">ড্রাফট</option>
          </select>

          <button
            onClick={() => {
              setSelectedSms(null);
              setIsModalOpen(true);
            }}
            className="bg-[#003366] text-white px-4 py-2 flex items-center gap-2 hover:bg-[#002244] transition-all text-sm font-bold"
          >
            <Plus size={18} /> নতুন এসএমএস
          </button>
        </div>
      </div>

      {/* কন্টেন্ট গ্রিড */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#003366]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smsList.map((sms) => (
            <div
              key={sms.id}
              className="border border-gray-200 p-4 rounded-sm hover:shadow-md transition-shadow relative bg-white"
            >
              <div
                key={sms.id}
                className="border border-gray-200 p-4 relative group bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-2">
                    {/* ক্যাটেগরি ব্যাজ */}
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-medium">
                      {sms.category?.name}
                    </span>

                    {/* স্ট্যাটাস ব্যাজ */}
                    <span
                      className={`text-[10px] px-2 py-1 rounded border font-bold ${
                        sms.status === "PUBLISHED"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {sms.status === "PUBLISHED" ? "পাবলিশড" : "খসড়া (Draft)"}
                    </span>
                  </div>

                  {/* ভিউ কাউন্ট (ঐচ্ছিক) */}
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    {sms.views} ভিউ
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {sms.content}
                </p>

                {/* অ্যাকশন বাটনসমূহ */}
                <div className="flex gap-3 pt-2 border-t">
                  <button
                    onClick={() => {
                      setSelectedSms(sms);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 flex items-center gap-1 text-xs"
                  >
                    <Edit size={14} /> এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(sms.id)}
                    className="text-red-600 flex items-center gap-1 text-xs"
                  >
                    <Trash2 size={14} /> ডিলিট
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* পেজিনেশন কন্ট্রোল */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 border-t pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold">
            পেজ {page} / {meta.totalPages}
          </span>
          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* মোডাল */}
      {isModalOpen && (
        <SmsModal
          initialData={selectedSms}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchSms();
          }}
        />
      )}
    </div>
  );
};

export default SmsListPage;
