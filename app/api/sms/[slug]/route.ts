import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  try {
    const categoryData = await prisma.category.findUnique({
      where: { slug },
      include: {
        // Get subcategories and count how many SMS each has
        subCategories: {
          include: {
            _count: {
              select: { sms: true },
            },
          },
        },
        // Get the actual SMS list for the main category
        sms: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { name: true, image: true } },
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });
    return NextResponse.json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    console.error("SUBCATEGORY_FETCH_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
