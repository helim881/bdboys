import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("API_CATEGORY_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
