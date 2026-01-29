import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const categoryId = params.id;

    const subCategories = await prisma.subCategory.findMany({
      where: {
        categoryId: categoryId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 },
    );
  }
}
