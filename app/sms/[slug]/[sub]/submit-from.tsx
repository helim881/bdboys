"use client";

import { createSmsAction } from "@/actions/action.sms";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SmsSubmitForm({
  categoryId,
  subCategoryId,
}: {
  categoryId: string;
  subCategoryId: string;
}) {
  const [title, setTitle] = useState(""); // New state for Title
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session, status } = useSession();

  const userRole = session?.user?.role;
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"];
  const canSubmit = allowedRoles.includes(userRole as string);

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Please add a title!");
    if (!content.trim()) return alert("Please write something!");

    startTransition(async () => {
      const result = await createSmsAction({
        title, // Pass title here
        content,
        categoryId,
        subCategoryId,
        authorId: session?.user?.id as string,
      });

      if (result.success) {
        setTitle("");
        setContent("");
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  };

  if (status === "unauthenticated" || !canSubmit) {
    return (
      <div className="p-2 border-b text-[12px] text-gray-500 italic">
        Please login with appropriate permissions to submit.
      </div>
    );
  }

  return (
    <div className="p-2 border-b border-gray-300 bg-[#f9f9f9]">
      <div className="mb-2">
        <label className="text-[11px] text-gray-500 font-bold uppercase">
          SMS Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          placeholder="Enter a short title..."
          className="w-full border border-gray-300 p-1 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div className="mb-2">
        <label className="text-[11px] text-gray-500 font-bold uppercase">
          Message Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          className="w-full border border-gray-300 h-20 outline-none p-1 text-sm focus:border-blue-400"
          placeholder="আপনার মেসেজ লিখুন..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-[#4a90e2] text-white px-6 py-1 text-[12px] font-bold rounded-sm shadow-sm hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? "Submitting..." : "SUBMIT SMS"}
      </button>
    </div>
  );
}
