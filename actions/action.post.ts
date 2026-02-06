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
        },
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

    revalidatePath("/admin/posts");
    revalidatePath(`/post/${updatedPost?.slug}`);
    return { success: true, data: updatedPost };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function movePostAction(formData: {
  postId: string;
  categoryId: string;
  subCategoryId: string;
}) {
  try {
    // 1. Verify Post Existence (Mock DB Check)
    const existingPost = await prisma.post.findUnique({
      where: { id: formData.postId },
    });

    if (!existingPost) {
      return { success: false, message: "Post no longer exists." };
    }

    // 2. Perform the Update
    await prisma.post.update({
      where: { id: formData.postId },
      data: {
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId,
      },
    });

    revalidatePath("/admin/posts/active");
    return { success: true, message: "Post successfully relocated." };
  } catch (error) {
    return {
      success: false,
      message: "A server error occurred. Please try again.",
    };
  }
}
export async function deletePostAction(slug: string) {
  try {
    // 1. Verify Post Existence (Mock DB Check)
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return { success: false, message: "Post no longer exists." };
    }

    // 2. Perform the Update
    await prisma.post.delete({
      where: { slug },
    });

    revalidatePath(`/post/${existingPost?.slug}`);

    return { success: true, message: "Post successfully relocated." };
  } catch (error) {
    return {
      success: false,
      message: "A server error occurred. Please try again.",
    };
  }
}
export async function updateStatusAction(
  id: string,
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED",
) {
  try {
    await prisma.post.update({
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
export async function toggleLike(postId: string, action: "like" | "unlike") {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          [action === "like" ? "increment" : "decrement"]: 1,
        },
      },
    });

    // Optional: if you want to revalidate the cache
    // revalidatePath(`/post/${updatedPost.slug}`);

    return { success: true, newCount: updatedPost.likeCount };
  } catch (error) {
    console.error("Like error:", error);
    return { success: false };
  }
}

export async function createComment(
  postId: string,
  authorName: string,
  content: string,
) {
  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        content,
      },
    });

    revalidatePath(`/post/[slug]`, "page"); // Refresh the page to show new comment
    return { success: true, comment };
  } catch (error) {
    return { success: false, error: "মন্তব্য পোস্ট করতে সমস্যা হয়েছে।" };
  }
}
