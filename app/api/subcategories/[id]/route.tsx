import { NextResponse } from "next/server";

import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 },
      );
    }

    const subcategory = await prisma.subCategory.findMany({
      where: { categoryId: id },
    });

    return NextResponse.json(
      {
        success: true,
        data: subcategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_POST_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
