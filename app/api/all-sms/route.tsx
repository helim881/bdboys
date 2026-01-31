import prisma from "@/lib/db"; // Adjust path to your Prisma client
import { PostStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 1. Extract Query Parameters
  const status = searchParams.get("status") as PostStatus | null;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Calculate offset
  const skip = (page - 1) * limit;

  try {
    // 2. Build the 'where' clause dynamically
    const whereClause = status ? { status } : {};

    // 3. Execute queries in parallel using a transaction
    const [messages, totalCount] = await prisma.$transaction([
      prisma.sms.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Sort by newest
        include: {
          category: true, // Optional: Include relations if needed
          subCategory: true,
          author: {
            select: { name: true, id: true }, // Avoid sending sensitive user data
          },
        },
      }),
      prisma.sms.count({ where: whereClause }),
    ]);

    // 4. Return Paginated Response
    return NextResponse.json({
      data: messages,
      meta: {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
