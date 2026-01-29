import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; slub: string } },
) {
  try {
    const { slub } = params;
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // 1️⃣ Fetch subcategory by slug
    const subCategory = await prisma.subCategory.findUnique({
      where: { slug: slub },
    });

    if (!subCategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 },
      );
    }

    // 2️⃣ Count total posts
    const totalPosts = await prisma.post.count({
      where: {
        subCategoryId: subCategory.id,
        status: "PUBLISHED",
      },
    });

    // 3️⃣ Fetch paginated posts
    const posts = await prisma.post.findMany({
      where: {
        subCategoryId: subCategory.id,
        status: "PUBLISHED",
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    // 4️⃣ Attach posts to subCategory object
    const subCategoryWithPosts = {
      ...subCategory,
      posts,
    };

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      success: true,
      data: subCategoryWithPosts,
      meta: {
        page,
        limit,
        total: totalPosts,
        totalPages,
      },
    });
  } catch (error) {
    console.error("SUBCATEGORY_FETCH_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
