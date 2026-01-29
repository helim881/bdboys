import prisma from "@/lib/db";
import { PostStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  try {
    const where: Prisma.PostWhereInput = {
      AND: [
        search ? { title: { contains: search, mode: "insensitive" } } : {},
        status && status !== "সব স্ট্যাটাস"
          ? { status: status.toUpperCase() as PostStatus }
          : {},
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: { select: { name: true } },
          author: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // --- DATA FORMATTING START ---
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      // Extract names from objects to strings
      category: post.category?.name || "Uncategorized",
      image: post.image,
      author: {
        name: post.author?.name || "Unknown Author",
      },
      status: post.status.toLowerCase(),
      content: post.content,
      // Format date for the UI
      date: new Date(post.createdAt).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));
    // --- DATA FORMATTING END ---

    return NextResponse.json({
      posts: formattedPosts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
