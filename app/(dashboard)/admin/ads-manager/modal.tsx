"use client";

import { updateAdAction } from "@/actions/action.ads";
import { Code, Loader2, Power, Save, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const AdEditModal = ({ ad, isOpen, onClose, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: ad?.code || "",
    isActive: ad?.isActive ?? true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateAdAction({
      placement: ad.placement,
      name: ad.name,
      ...formData,
    });

    if (result.success) {
      toast.success("সফলভাবে আপডেট করা হয়েছে");
      onSuccess();
      onClose();
    } else {
      toast.error("সেভ করা সম্ভব হয়নি");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{ad.name}</h3>
            <p className="text-xs text-slate-500">
              Placement ID: <span className="font-mono">{ad.placement}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${formData.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}
              >
                <Power size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">
                  বিজ্ঞাপন সক্রিয় করুন
                </p>
                <p className="text-[11px] text-slate-500">
                  এটি বন্ধ করলে সাইটে বিজ্ঞাপন দেখাবে না
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, isActive: !formData.isActive })
              }
              className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          {/* Ad Code Editor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
              <Code size={14} className="text-blue-500" /> অ্যাড কোড (HTML/JS)
            </label>
            <textarea
              rows={10}
              spellCheck={false}
              placeholder=""
              className="w-full px-4 py-3 bg-slate-900 text-blue-400 font-mono text-sm rounded-2xl outline-none border border-slate-800 focus:ring-2 focus:ring-blue-500/20"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              বাতিল
            </button>
            <button
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
