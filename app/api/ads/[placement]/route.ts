import prisma from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/ads/[placement]
 * Fetches the HTML/JS code for a specific ad placement
 */
export async function GET(
  request: Request,
  { params }: { params: { placement: string } },
) {
  try {
    const { placement } = params;

    const ad = await prisma.ad.findUnique({
      where: {
        placement: placement,
      },
      select: {
        code: true,
        isActive: true,
        name: true,
      },
    });

    // If ad doesn't exist or is disabled, return an empty response
    if (!ad || !ad.isActive) {
      return NextResponse.json(
        { code: "", status: "inactive" },
        { status: 200 },
      );
    }

    return NextResponse.json({
      name: ad.name,
      code: ad.code,
      status: "active",
    });
  } catch (error) {
    console.error("FETCH_AD_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
