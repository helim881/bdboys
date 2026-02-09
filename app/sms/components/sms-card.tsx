"use client";

import {
  deleteSms,
  toggleSmsAction,
  updateSmsAction,
} from "@/actions/action.sms";
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

  const [isSendMode, setIsSendMode] = useState(false);
  const [isAdminEdit, setIsAdminEdit] = useState(false);
  const [tempText, setTempText] = useState(sms?.content || "");
  const [dbText, setDbText] = useState(sms?.content || "");

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
      const result = await updateSmsAction(sms.id, {
        content: dbText,
        categoryId: sms.categoryId,
        subCategoryId: sms.subCategoryId,
        status: sms.status,
      });

      if (result?.success) {
        setIsAdminEdit(false);
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

  return (
    <div
      className={`border m-4 border-gray-200 bg-white transition-opacity ${
        isPending ? "opacity-50" : "opacity-100"
      } flex flex-col`}
    >
      <div className="p-4 flex gap-3">
        {/* --- Numbering Section --- */}
        {typeof index === "number" && (
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-red-50 text-red-600 rounded-full text-sm font-bold mt-1 border border-red-100">
            {index + 1}
          </div>
        )}

        {/* --- Content Section --- */}
        <div className="flex-1">
          {/* Database Edit Mode */}
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

          {/* Send/Copy Mode */}
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
            <div className="text-[16px] leading-relaxed text-gray-800 mb-3 whitespace-pre-wrap">
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

            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                By
                <Link
                  href={`/my/${sms?.authorId}`}
                  className="font-bold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {sms?.author?.name || "Anonymous"}
                </Link>
              </p>

              {/* --- Created Time --- */}
              <span className="text-[10px] text-gray-300">•</span>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                📅{" "}
                {sms?.createdAt
                  ? new Date(sms.createdAt).toLocaleDateString("bn-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "অজানা সময়"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-gray-50/80 py-2.5 px-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-[13px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction("LIKE")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-white transition-all ${
              sms?.isLiked
                ? "text-orange-600 border-orange-200 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Heart size={14} className={sms?.isLiked ? "fill-current" : ""} />
            {sms?.likeCount || 0}
          </button>
          <button
            onClick={() => handleAction("DISLIKE")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-white transition-all ${
              sms?.isDisliked
                ? "text-gray-800 border-gray-400"
                : "text-gray-500"
            }`}
          >
            <HeartCrack size={14} /> {sms?.disLikeCount || 0}
          </button>
        </div>

        <div className="h-4 w-[1px] bg-gray-300 hidden sm:block" />

        <button
          onClick={() => {
            setIsSendMode(!isSendMode);
            setIsAdminEdit(false);
          }}
          className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
        >
          <MessageCircle size={15} /> Copy this
        </button>

        {canModify && (
          <div className="flex items-center gap-4">
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
          </div>
        )}
      </div>
    </div>
  );
}
