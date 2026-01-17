// app/admin/posts/actions.ts
"use server";

import cloudinary from "@/config/cloudinary";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: any, authorId: string) {
  try {
    let imageUrl = formData.featuredImage;

    // 1. Upload to Cloudinary if an image exists
    if (
      formData.featuredImage &&
      formData.featuredImage.startsWith("data:image")
    ) {
      const uploadResponse = await cloudinary.uploader.upload(
        formData.featuredImage,
        {
          folder: "blog_posts",
        }
      );
      imageUrl = uploadResponse.secure_url; // Use the secure HTTPS URL
    }

    // 2. Generate Slug (Improved to support Bangla)
    const slug =
      formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\u0980-\u09FFa-z0-9]+/g, "-") // Regex for Bangla + English
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 7);

    // 3. Create Post in Database
    const post = await prisma.post.create({
      data: {
        title: formData.title,
        slug: slug,
        content: formData.content,
        contentHtml: formData.content,
        image: imageUrl, // Saved Cloudinary URL
        status: "PUBLISHED",
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId || null,
        authorId: authorId,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/posts");
    return { success: true, post };
  } catch (error) {
    console.error("Post Creation Error:", error);
    return { success: false, error: "Failed to create post" };
  }
}
export async function updatePostAction(id: string, data: any) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        image: data.featuredImage,
        status: data.status,
      },
    });

    revalidatePath("/admin/posts"); // Adjust path as needed
    return { success: true, data: updatedPost };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
