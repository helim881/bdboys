"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData) {
  try {
    // 1. Extract all text fields from FormData
    const data = {
      siteName: formData.get("siteName") as string,
      siteUrl: formData.get("siteUrl") as string,
      siteEmail: formData.get("siteEmail") as string,
      description: formData.get("description") as string,
      keywords: formData.get("keywords") as string,
      googleMeta: formData.get("googleMeta") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      fbAdminId: formData.get("fbAdminId") as string,
      fbAppId: formData.get("fbAppId") as string,
      googlePlusId: formData.get("googlePlusId") as string,
      analyticsId: formData.get("analyticsId") as string,
    };

    // 2. Handle Logo Upload
    const logoFile = formData.get("siteLogo") as File; // Matches the "name" attribute in your UI
    let siteLogoUrl = formData.get("currentLogo") as string;

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
      siteLogoUrl = uploadResponse.secure_url;
    }

    // 3. Database Sync
    // We combine the extracted text data with the (potentially new) logo URL
    const finalData = {
      ...data,
      siteLogo: siteLogoUrl,
    };

    await prisma.setting.upsert({
      where: { id: 1 },
      update: finalData,
      create: {
        id: 1,
        ...finalData,
      },
    });

    // 4. Revalidate cache
    // Revalidating the root layout ensures headers, footers, and meta tags update site-wide
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Settings Update Error:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
