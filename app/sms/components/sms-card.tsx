"use client";

import { deleteSms, toggleSmsAction } from "@/actions/action.sms";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTransition } from "react";

export default function SmsCard({
  sms,
  index = 0,
}: {
  index?: number;
  sms: any;
}) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // Permissions check
  // Permissions check
  const userRole = session?.user?.role;
  const userId = session?.user?.id;

  const canModify =
    userRole === "SUPER_ADMIN" ||
    userRole === "ADMIN" ||
    userRole === "EDITOR" ||
    userId === sms?.authorId;

  // --- Handlers using Server Actions ---

  const handleAction = (type: "LIKE" | "DISLIKE") => {
    // startTransition wraps the server call to manage loading states
    startTransition(async () => {
      const result = await toggleSmsAction(sms.id, type);
      if (!result.success) alert(result.error);
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this SMS?")) return;

    startTransition(async () => {
      const result = await deleteSms(sms.id);
      if (result?.error) alert(result.error);
    });
  };
  console.log(sms);

  return (
    <div
      className={`border-b border-gray-200 last:border-0 font-sans transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}
    >
      <div className="p-2 bg-white">
        <div className="text-[14px] leading-[1.4] text-black">
          <span className="text-red-600 font-bold mr-1">{index + 1})</span>
          {sms.content}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
            {sms?.author?.image ? (
              <img
                src={sms.author.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={12} className="text-gray-500" />
            )}
          </div>

          <span className="text-gray-400">By</span>
          <Link
            href={`/profile/${sms?.authorId}`}
            className="text-[#555555] font-semibold hover:text-blue-700 hover:underline flex items-center gap-0.5 transition-colors"
          >
            {sms?.author?.name}
          </Link>
        </div>
      </div>

      {/* Classic Action Bar */}
      <div className="bg-[#f0f4f7] py-1 px-2 border-t border-gray-100 flex flex-wrap gap-2 text-[12px] text-blue-800">
        <button
          disabled={isPending}
          onClick={() => handleAction("LIKE")}
          className="hover:underline active:text-blue-500 disabled:text-gray-400"
        >
          Like ({sms.likeCount || 0})
        </button>
        <span className="text-gray-300">-</span>
        <button
          disabled={isPending}
          onClick={() => handleAction("DISLIKE")}
          className="hover:underline active:text-red-500 disabled:text-gray-400"
        >
          Dislike ({sms.dislikeCount || 0})
        </button>
        <span className="text-gray-300">-</span>
        <button className="hover:underline">Send This</button>

        {canModify && (
          <>
            <span className="text-gray-300">-</span>
            <button
              disabled={isPending}
              onClick={handleDelete}
              className="hover:underline text-red-600 font-bold disabled:text-gray-400"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
