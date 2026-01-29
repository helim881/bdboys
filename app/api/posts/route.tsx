import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Logic to fetch from your Database
  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalCount = await prisma.post.count();

  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({
    data: posts, // Replace with real data
    totalPages,
    currentPage: page,
  });
}
