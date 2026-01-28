import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// Import the Enum type from your generated Prisma client
import { CategoryType, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 1. Create a typed where object
    let whereClause: Prisma.CategoryWhereInput = {};

    // 2. Only apply if type exists AND is a valid Enum value
    if (type && Object.values(CategoryType).includes(type as CategoryType)) {
      whereClause.type = type as CategoryType;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        subCategories: true,
        _count: {
          select: {
            subCategories: true,
            sms: true,
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("API_CATEGORY_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
