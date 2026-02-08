"use client";

import {
  deleteSms,
  toggleSmsAction,
  updateSmsAction,
} from "@/actions/action.sms"; // updateSms অ্যাকশনটি ইম্পোর্ট করুন
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit3,
  Heart,
  HeartCrack,
  MessageCircle,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function SmsCard({ sms, index }: { index?: number; sms: any }) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // States for two different modes
  const [isSendMode, setIsSendMode] = useState(false); // For all users (Copy/Share)
  const [isAdminEdit, setIsAdminEdit] = useState(false); // For Admin/Owner (Database update)

  const [tempText, setTempText] = useState(sms?.content || ""); // Sharing text
  const [dbText, setDbText] = useState(sms?.content || ""); // Database update text

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
  const handleUpdate = () => {
    startTransition(async () => {
      // এখানে sms অবজেক্ট থেকে আগের সব ডাটা এবং নতুন dbText পাঠানো হচ্ছে
      const result = await updateSmsAction(sms.id, {
        content: dbText,
        categoryId: sms.categoryId, // আগের ক্যাটাগরি আইডি
        subCategoryId: sms.subCategoryId, // আগের সাব-ক্যাটাগরি আইডি (থাকলে)
        status: sms.status, // আগের স্ট্যাটাস
      });

      if (result?.success) {
        setIsAdminEdit(false);
        // ঐচ্ছিক: একটি সাকসেস মেসেজ দেখাতে পারেন
      } else {
        alert(result?.error || "Failed to update");
      }
    });
  };
  const shareSms = (platform: "whatsapp" | "sms") => {
    const text = encodeURIComponent(tempText);
    let url =
      platform === "whatsapp"
        ? `https://wa.me/?text=${text}`
        : `sms:?body=${text}`;
    window.open(url, "_blank");
  };
  console.log(sms);

  return (
    <div
      className={`border-b border-gray-200 bg-white ${isPending ? "opacity-50" : "opacity-100"}`}
    >
      <div className="p-4">
        {/* 1. Database Edit Mode (Admin/Owner only) */}
        {isAdminEdit ? (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
            <span className="text-[10px] font-bold text-red-500 uppercase">
              Updating Database:
            </span>
            <textarea
              className="w-full border-2 border-red-200 p-3 rounded-lg text-sm focus:border-red-400 outline-none h-24 mt-1 bg-white"
              value={dbText}
              onChange={(e) => setDbText(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdate}
                className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Save Change
              </button>
              <button
                onClick={() => setIsAdminEdit(false)}
                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {/* 2. Send/Copy Mode (For All Users) */}
        {isSendMode ? (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-[10px] font-bold text-blue-500 uppercase">
              Customize before send:
            </span>
            <textarea
              className="w-full border-2 border-blue-200 p-3 rounded-lg text-sm focus:border-blue-400 outline-none h-24 mt-1 bg-white"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => shareSms("whatsapp")}
                className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
              >
                <Send size={12} /> WhatsApp
              </button>
              <button
                onClick={() => shareSms("sms")}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
              >
                <Phone size={12} /> SMS
              </button>
              <button
                onClick={() => setIsSendMode(false)}
                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {/* Regular SMS View */}
        {!isAdminEdit && !isSendMode && (
          <div className="text-[16px] leading-relaxed text-gray-800 mb-3">
            {index !== undefined && (
              <span className="text-red-600 font-bold mr-2">{index + 1}.</span>
            )}
            {sms?.content}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-2 mt-3">
          {/* Shadcn UI Avatar */}
          <Avatar className="w-7 h-7 border border-gray-100 shadow-sm">
            <AvatarImage
              src={sms?.author?.image}
              alt={sms?.author?.name || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-blue-100 text-[10px] font-bold text-blue-600 uppercase italic">
              {sms?.author?.name?.[0] || <User size={12} />}
            </AvatarFallback>
          </Avatar>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            By
            <Link
              href={`/my/${sms?.authorId}`}
              className="font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              {sms?.author?.name || "Anonymous"}
            </Link>
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-gray-50/80 py-2.5 px-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-[13px]">
        {/* Like/Dislike (Same as before) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction("LIKE")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-white ${sms?.isLiked ? "text-orange-600 border-orange-200" : "text-gray-500"}`}
          >
            <Heart size={14} className={sms?.isLiked ? "fill-current" : ""} />{" "}
            {sms?.likeCount || 0}
          </button>
          <button
            onClick={() => handleAction("DISLIKE")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-white ${sms?.isDisliked ? "text-gray-800 border-gray-400" : "text-gray-500"}`}
          >
            <HeartCrack size={14} /> {sms?.disLikeCount || 0}
          </button>
        </div>

        <div className="h-4 w-[1px] bg-gray-300" />

        {/* Button 1: Send This (For Everyone) */}
        <button
          onClick={() => {
            setIsSendMode(!isSendMode);
            setIsAdminEdit(false);
          }}
          className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
        >
          <MessageCircle size={15} /> Copy this
        </button>

        {/* Button 2: Edit (Only for Owner/Admin) */}
        {canModify && (
          <>
            <button
              onClick={() => {
                setIsAdminEdit(!isAdminEdit);
                setIsSendMode(false);
              }}
              className="flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-800"
            >
              <Edit3 size={15} /> Edit Post
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 font-bold hover:underline"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
