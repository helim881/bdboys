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

    const subcategoriesSms = await prisma.subCategory.findUnique({
      where: { slug: slub },
      include: {
        category: true,
        sms: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true } } },
        },
      },
    });

    if (!subcategoriesSms) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 },
      );
    }

    // 2️⃣ Count total posts
    const totalPosts = await prisma.post.count({
      where: {
        subCategoryId: subcategoriesSms.id,
        status: "PUBLISHED",
      },
    });

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      success: true,
      data: subcategoriesSms,
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
