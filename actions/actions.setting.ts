"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData) {
  try {
    const siteName = formData.get("siteName") as string;
    const description = formData.get("description") as string;
    const keywords = formData.get("keywords") as string;
    const facebookUrl = formData.get("facebookUrl") as string;
    const logoFile = formData.get("logo") as File;

    let logoUrl = formData.get("currentLogo") as string;

    // If a new logo is uploaded
    if (logoFile && logoFile.size > 0) {
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "site_assets" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
      logoUrl = uploadResponse.secure_url;
    }

    await prisma.setting.upsert({
      where: { id: 1 },
      update: {
        siteName,
        description,
        keywords,
        facebookUrl,
        siteLogo: logoUrl,
      },
      create: {
        id: 1,
        siteName,
        description,
        keywords,
        facebookUrl,
        siteLogo: logoUrl,
      },
    });

    revalidatePath("/", "layout"); // Refresh global components like Navbar/Metadata
    return { success: true };
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
}
