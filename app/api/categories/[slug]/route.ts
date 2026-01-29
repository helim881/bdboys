import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);

    // পেজিনেশন প্যারামিটার
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    // ১. মোট সাব-ক্যাটাগরি সংখ্যা বের করা (মেটার জন্য)
    const totalSubcategories = await prisma.category.count({
      where: { slug },
    });

    // ২. সাব-ক্যাটাগরি এবং পোস্ট ফেচ করা
    const subcategories = await prisma.category.findUnique({
      where: { slug },

      include: {
        subCategories: {
          select: {
            slug: true,
            name: true,
            posts: {
              where: { status: "PUBLISHED" },
              take: 5,
              orderBy: { createdAt: "desc" },
              include: {
                author: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(totalSubcategories / limit);

    return NextResponse.json({
      success: true,
      data: subcategories,
      meta: {
        page,
        limit,
        total: totalSubcategories,
        totalPage: totalPages,
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
