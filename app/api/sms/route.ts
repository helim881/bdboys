import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const categoriesWithSms = await prisma.category.findMany({
      where: { type: "SMS" },
      include: {
        sms: {
          where: { status: "PUBLISHED" },
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    return NextResponse.json({
      data: categoriesWithSms,
    });
  } catch (error) {
    console.error("API_SMS_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
