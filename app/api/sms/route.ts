import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // ১. কুয়েরি প্যারামিটারগুলো নেওয়া
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // যেমন: PUBLISHED, DRAFT
    const skip = (page - 1) * limit;

    // ২. ফিল্টার কন্ডিশন তৈরি করা
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    // ৩. ডাটা এবং টোটাল কাউন্ট একসাথে ফেচ করা
    const [allSms, totalCount] = await Promise.all([
      prisma.sms.findMany({
        where,
        include: {
          category: { select: { name: true } },
          subCategory: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      }),
      prisma.sms.count({ where }),
    ]);

    // ৪. রেসপন্সে ডাটার পাশাপাশি মেটাডাটা পাঠানো
    return NextResponse.json({
      data: allSms,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("API_SMS_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
