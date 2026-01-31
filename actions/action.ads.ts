"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateAdAction(data: {
  placement: string;
  name: string;
  code: string;
  isActive: boolean;
}) {
  try {
    const updatedAd = await prisma.ad.upsert({
      where: { placement: data.placement },
      update: {
        code: data.code,
        isActive: data.isActive,
      },
      create: {
        placement: data.placement,
        name: data.name,
        code: data.code,
        isActive: data.isActive,
      },
    });

    // Clear cache so the frontend shows new ads immediately
    revalidatePath("/dashboard/manage-ads");
    revalidatePath("/"); // Revalidate home/frontend as well

    return { success: true, data: updatedAd };
  } catch (error) {
    console.error("AD_UPDATE_ERROR:", error);
    return { success: false, error: "Failed to update advertisement" };
  }
}
