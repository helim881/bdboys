import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // পেজিনেশন প্যারামিটার (Default: Page 1, Limit 10)
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // ১. মোট ক্যাটাগরি সংখ্যা গণনা (মেটা ডাটার জন্য)
    const totalCategories = await prisma.category.count({
      where: { type: "POST" },
    });

    // ২. পেজিনেটেড ক্যাটাগরি ডাটা ফেচ
    const categoriesWithPosts = await prisma.category.findMany({
      where: { type: "POST" },
      skip: skip,
      take: limit,
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          include: { author: { select: { name: true } } },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalPages = Math.ceil(totalCategories / limit);

    return NextResponse.json({
      success: true,
      data: categoriesWithPosts,
      meta: {
        page,
        limit,
        total: totalCategories,
        totalPage: totalPages,
      },
    });
  } catch (error) {
    console.error("PAGINATION_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
