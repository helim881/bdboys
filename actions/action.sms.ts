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
  status: PostStatus;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Unauthorized" };

    // Use Title for slug, fallback to content if empty
    const slugBase = data.content.slice(0, 20);
    const slug = `${slugBase.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    await prisma.sms.create({
      data: {
        content: data.content,
        slug: slug,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId || null,
        authorId: session.user.id,
        status: data.status || "PENDING",
      },
    });

    revalidatePath("/sms/[slug]/[sub]", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Submission failed" };
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
  },
) {
  console.log(data);
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
export async function updateSmsStatusAction(
  id: string,
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED",
) {
  try {
    await prisma.sms.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/sms");
    return { success: true };
  } catch (error) {
    console.error("Status Update Error:", error);
    return { success: false };
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

import { authOptions } from "@/app/api/auth/option";
import { getServerSession } from "next-auth";

// Action for Like/Dislike
export async function toggleSmsAction(smsId: string, type: "LIKE" | "DISLIKE") {
  try {
    if (type === "LIKE") {
      await prisma.sms.update({
        where: { id: smsId },
        data: { likeCount: { increment: 1 } },
      });
    } else {
      await prisma.sms.update({
        where: { id: smsId },
        data: { disLikeCount: { increment: 1 } },
      });
    }

    // Refresh the data on the current page
    revalidatePath("/sms/[slug]", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update action" };
  }
}

// Action for Delete
export async function deleteSms(smsId: string) {
  const session = await getServerSession(authOptions);

  // 1. Check if session exists
  if (!session || !session.user) {
    return { error: "You must be logged in to delete." };
  }

  // 2. Fetch SMS to check ownership
  const sms = await prisma.sms.findUnique({
    where: { id: smsId },
    select: { authorId: true }, // Only fetch what we need
  });

  if (!sms) return { error: "SMS not found" };

  // 3. Robust Permission Check
  const userRole = session.user.role;
  const userId = session.user.id;

  // Use an array to check for high-level permissions
  const hasPrivilege = ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(userRole);
  const isOwner = userId === sms.authorId;

  if (!hasPrivilege && !isOwner) {
    return { error: "Unauthorized: You don't have permission." };
  }

  try {
    // 4. Perform Delete
    await prisma.sms.delete({ where: { id: smsId } });

    // 5. Revalidate
    // Use the actual path if possible, or the specific dynamic route
    revalidatePath("/sms/[slug]", "layout");
    revalidatePath("/sms/[slug]/[sub]", "layout");

    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Database error occurred." };
  }
}
