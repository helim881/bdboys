// app/admin/categories/actions.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Define an interface for the incoming data
interface CategoryInput {
  name: string;
  type: "POST" | "SMS";
  metaTitle?: string;
  tags?: string;
  metaDescription?: string;
}

export async function createCategoryAction(data: CategoryInput) {
  const { name, type, metaTitle, tags, metaDescription } = data;

  // 1. Validation
  if (!name) return { success: false, error: "নাম প্রয়োজন" };

  // 2. Enhanced Slug Generation
  // Handles Bengali characters, removes trailing dashes, and ensures uniqueness
  const slug = name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0980-\u09FFa-zA-Z0-9-]+/g, "") // Keep Bengali + Alphanumeric
    .toLowerCase()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        type,
        metaTitle: metaTitle || null,
        tags: tags || null,
        metaDescription: metaDescription || null,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Database Error:", error);

    // Prisma Unique Constraint Error
    if (error.code === "P2002") {
      return {
        success: false,
        error: "এই নামে বা স্লাগে অলরেডি ক্যাটেগরি আছে",
      };
    }

    return { success: false, error: "ডাটাবেসে সেভ করা সম্ভব হয়নি" };
  }
}

interface UpdateCategoryInput {
  name: string;
  type: "POST" | "SMS";
  metaTitle?: string;
  tags?: string;
  metaDescription?: string;
}

export async function updateCategoryAction(
  id: string,
  data: UpdateCategoryInput,
) {
  try {
    const { name, type, metaTitle, tags, metaDescription } = data;

    if (!name) return { success: false, error: "নাম প্রয়োজন" };

    // Generate slug (consistent with create logic)
    const slug = name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0980-\u09FFa-zA-Z0-9-]+/g, "")
      .toLowerCase()
      .replace(/^-+|-+$/g, "");

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        type,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        tags: tags || null,
        // Syncing description with metaDescription for internal consistency
        description: metaDescription || null,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Update Error:", error);

    // Handle duplicate name or slug error
    if (error.code === "P2002") {
      return {
        success: false,
        error: "এই নামে বা স্লাগে অন্য একটি ক্যাটেগরি অলরেডি আছে",
      };
    }

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
  categoryId: string,
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
  categoryId: string,
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
