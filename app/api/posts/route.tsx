import prisma from "@/lib/db";
import { PostStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  try {
    const where: Prisma.PostWhereInput = {
      AND: [
        search ? { title: { contains: search, mode: "insensitive" } } : {},
        status && status !== "সব স্ট্যাটাস"
          ? { status: status.toUpperCase() as PostStatus }
          : {},
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          subCategory: { select: { name: true, slug: true } },
          author: { select: { name: true, image: true, id: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
