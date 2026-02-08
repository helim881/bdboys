import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ১. কুয়েরি প্যারামিটার থেকে ডাটা নেওয়া
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 15;
    const skip = (page - 1) * limit;

    // userId না থাকলে এরর রিটার্ন করা
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "UserId প্রয়োজন" },
        { status: 400 },
      );
    }

    // ২. প্যারালাল কুয়েরি (পারফরম্যান্স ভালো করার জন্য)
    const [totalPosts, posts] = await Promise.all([
      prisma.post.count({
        where: { authorId: userId },
      }),
      prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
        include: {
          category: {
            select: { name: true, slug: true },
          },

          author: {
            select: { name: true, image: true },
          },
        },
      }),
    ]);

    // ৩. রেসপন্স পাঠানো
    return NextResponse.json({
      success: true,
      data: posts,
      meta: {
        totalItems: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        hasNextPage: skip + posts.length < totalPosts,
      },
    });
  } catch (error) {
    console.error("USER_POSTS_FETCH_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভার এরর: পোস্ট লোড করা যায়নি" },
      { status: 500 },
    );
  }
}
