import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/ads - Fetch all stored ads
export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json(
      { error: "বিজ্ঞাপন লোড করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

// POST /api/ads - Create a new ad entry manually
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, placement, code, isActive } = body;

    const newAd = await prisma.ad.create({
      data: { name, placement, code, isActive },
    });

    return NextResponse.json(newAd);
  } catch (error) {
    return NextResponse.json(
      { error: "বিজ্ঞাপন তৈরি করা সম্ভব হয়নি" },
      { status: 500 },
    );
  }
}
