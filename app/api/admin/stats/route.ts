import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      pendingPosts,
      activePosts,
      categoryCount,
      pendingSms,
      activeSms,
      smsCategoryCount,
      userCount,
    ] = await Promise.all([
      prisma.post.count({
        where: { status: "PENDING" },
      }),
      prisma.post.count({
        where: { status: "PUBLISHED" },
      }),
      prisma.category.count({
        where: {
          type: "POST",
        },
      }),
      prisma.sms.count({
        where: { status: "PENDING" },
      }),
      prisma.sms.count({
        where: { status: "PUBLISHED" },
      }),
      prisma.category.count({
        where: {
          type: "SMS",
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pendingPosts,
        activePosts,
        categoryCount,
        pendingSms,
        activeSms,
        smsCategoryCount,
        userCount,
      },
    });
  } catch (error) {
    console.error("ADMIN_STATS_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
