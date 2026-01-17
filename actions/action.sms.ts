"use server";

import prisma from "@/lib/db";
import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ১. তৈরি করা (Create)
export async function createSmsAction(data: {
  content: string;
  categoryId: string;
  subCategoryId?: string;
  authorId: string;
}) {
  try {
    // কন্টেন্টের প্রথম অংশ দিয়ে একটি ইউনিক স্লাগ তৈরি (যেহেতু এসএমএসের টাইটেল নেই)
    const baseSlug = data.content
      .slice(0, 30)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0980-\u09FFa-zA-Z0-0-]+/g, "");

    const slug = `${baseSlug}-${Date.now()}`;

    await prisma.sms.create({
      data: {
        content: data.content,
        slug: slug,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId || null,
        authorId: data.authorId,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin/sms");
    return { success: true };
  } catch (error: any) {
    console.error("SMS_CREATE_ERROR:", error);
    return { success: false, error: "এসএমএস তৈরি করা সম্ভব হয়নি।" };
  }
}

// ২. আপডেট করা (Update)
export async function updateSmsAction(
  id: string,
  data: {
    content: string;
    categoryId: string;
    subCategoryId?: string;
    status: PostStatus;
  }
) {
  try {
    await prisma.sms.update({
      where: { id },
      data: {
        content: data.content,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId || null,
        status: data?.status,
      },
    });

    revalidatePath("/admin/sms");
    return { success: true };
  } catch (error: any) {
    console.error("SMS_UPDATE_ERROR:", error);
    return { success: false, error: "আপডেট করা সম্ভব হয়নি।" };
  }
}

// ৩. ডিলিট করা (Delete)
export async function deleteSmsAction(id: string) {
  try {
    await prisma.sms.delete({ where: { id } });
    revalidatePath("/admin/sms");
    return { success: true };
  } catch (error: any) {
    console.error("SMS_DELETE_ERROR:", error);
    return { success: false, error: "মুছে ফেলা সম্ভব হয়নি।" };
  }
}
