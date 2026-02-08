import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "3");
    const skip = (page - 1) * limit;

    // ১. টোটাল কাউন্ট বের করা (মেটাডাটা এবং পেজিনেশনের জন্য)
    const totalCount = await prisma.sms.count({
      where: { status: "PUBLISHED" },
    });

    // ২. সরাসরি SMS টেবিল থেকে পপুলার ডাটা ফেচ করা (বেটার পারফরম্যান্স)
    const smsItems = await prisma.sms.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { likeCount: "desc" },
      take: limit,
      skip: skip,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // ৩. আপনার দেওয়া ফরম্যাটে ম্যাপিং
    const formattedSms = smsItems.map((item) => ({
      id: item.id,
      content: item.content,
      slug: item.slug,
      title: item.title,
      status: item.status,
      likeCount: item.likeCount || 0,
      disLikeCount: item.disLikeCount || 0,
      views: item.views || 0,
      categoryId: item.categoryId,
      subCategoryId: item.subCategoryId,
      authorId: item.authorId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: {
        id: item.author?.id,
        name: item.author?.name,
        image: item.author?.image,
      },
    }));

    return NextResponse.json({
      success: true,
      data: formattedSms,
      meta: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("POPULAR_SMS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular sms" },
      { status: 500 },
    );
  }
}
