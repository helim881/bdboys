import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    console.error("API_SUBCATEGORY_GET_ERROR:", error);
    return NextResponse.json(
      { error: "সাব-ক্যাটেগরি লোড করতে ব্যর্থ" },
      { status: 500 },
    );
  }
}
