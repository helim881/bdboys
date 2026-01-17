// app/admin/categories/actions.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- CREATE ACTION ---
export async function createCategoryAction(name: string, type: "POST" | "SMS") {
  if (!name) return { success: false, error: "নাম প্রয়োজন" };

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0980-\u09FFa-zA-Z0-9-]+/g, "");

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        type, // Passing the type here
      },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Database Error:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "এই নামে বা স্লাগে অলরেডি ক্যাটেগরি আছে",
      };
    }
    return { success: false, error: "ডাটাবেসে সেভ করা সম্ভব হয়নি" };
  }
}

// --- UPDATE ACTION ---
export async function updateCategoryAction(
  id: string,
  data: { name: string; type: "POST" | "SMS" }
) {
  try {
    const { name, type } = data;

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0980-\u09FFa-zA-Z0-9-]+/g, "");

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        type,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, error: "আপডেট করা সম্ভব হয়নি" };
  }
}

// --- DELETE ACTION ---
export async function deleteCategoryAction(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: "ডিলিট করা সম্ভব হয়নি। হয়তো এই ক্যাটেগরিতে পোস্ট রয়েছে।",
    };
  }
}

// ১. তৈরি করা
export async function createSubCategoryAction(
  name: string,
  categoryId: string
) {
  try {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0980-\u09FFa-zA-Z0-0-]+/g, "");
    await prisma.subCategory.create({
      data: { name, slug, categoryId },
    });
    revalidatePath("/admin/subcategories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "তৈরি করা সম্ভব হয়নি" };
  }
}

// ২. আপডেট করা
export async function updateSubCategoryAction(
  id: string,
  name: string,
  categoryId: string
) {
  try {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0980-\u09FFa-zA-Z0-0-]+/g, "");
    await prisma.subCategory.update({
      where: { id },
      data: { name, slug, categoryId },
    });
    revalidatePath("/admin/subcategories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "আপডেট করা সম্ভব হয়নি" };
  }
}

// ৩. ডিলিট করা
export async function deleteSubCategoryAction(id: string) {
  try {
    await prisma.subCategory.delete({ where: { id } });
    revalidatePath("/admin/subcategories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "ডিলিট করা সম্ভব হয়নি" };
  }
}
