"use client";

import { deleteSms, toggleSmsAction } from "@/actions/action.sms";
import { Phone, Send, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function SmsCard({
  sms,
  index = 0,
}: {
  index?: number;
  sms: any;
}) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(sms?.content || "");

  const canModify =
    session?.user?.role === "SUPER_ADMIN" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.id === sms?.authorId;

  const handleAction = (type: "LIKE" | "DISLIKE") => {
    startTransition(async () => {
      const result = await toggleSmsAction(sms.id, type);
      if (!result.success) alert(result.error);
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const result = await deleteSms(sms.id);
      if (result?.error) alert(result.error);
    });
  };

  // --- শেয়ার ফাংশন ---
  const shareSms = (platform: "whatsapp" | "messenger" | "sms") => {
    const text = encodeURIComponent(editedText);
    let url = "";

    if (platform === "whatsapp") url = `https://wa.me/?text=${text}`;
    if (platform === "messenger") url = `fb-messenger://share/?link=${text}`; // এটি মোবাইল অ্যাপে কাজ করবে
    if (platform === "sms") url = `sms:?body=${text}`;

    window.open(url, "_blank");
  };

  return (
    <div
      className={`border-b border-gray-200 bg-white transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}
    >
      <div className="p-3">
        {/* কন্টেন্ট এরিয়া */}
        {!isEditing ? (
          <div className="text-[15px] leading-relaxed text-gray-800 mb-2">
            <span className="text-red-600 font-bold mr-1">{index + 1})</span>
            {sms?.content}
          </div>
        ) : (
          <div className="mb-3 animate-in fade-in duration-300">
            <textarea
              className="w-full border-2 border-blue-100 p-2 rounded-lg text-sm focus:border-blue-400 outline-none h-24 resize-none"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => shareSms("whatsapp")}
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold"
              >
                <Send size={14} /> WhatsApp
              </button>
              <button
                onClick={() => shareSms("sms")}
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold"
              >
                <Phone size={14} /> SMS
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* অথর ইনফো */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 border flex items-center justify-center overflow-hidden">
            {sms?.author?.image ? (
              <img
                src={sms?.author?.image}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <User size={12} className="text-gray-500" />
            )}
          </div>
          <span className="text-xs text-gray-400">By</span>
          <Link
            href={`/profile/${sms?.authorId}`}
            className="text-xs font-semibold text-gray-600 hover:text-blue-600"
          >
            {sms?.author?.name}
          </Link>
        </div>
      </div>

      {/* অ্যাকশন বার */}
      <div className="bg-[#f8fafc] py-1.5 px-3 border-t border-gray-100 flex items-center gap-3 text-[12px] text-blue-700">
        <button
          onClick={() => handleAction("LIKE")}
          className="hover:underline font-medium"
        >
          Like ({sms?.likeCount || 0})
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => handleAction("DISLIKE")}
          className="hover:underline font-medium"
        >
          Dislike ({sms?.dislikeCount || 0})
        </button>
        <span className="text-gray-300">|</span>

        {/* Send This বাটন যা এডিট মোড অন করবে */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`hover:underline font-bold ${isEditing ? "text-orange-600" : ""}`}
        >
          {isEditing ? "Editing..." : "Send This"}
        </button>

        {canModify && (
          <>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:underline font-bold"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
