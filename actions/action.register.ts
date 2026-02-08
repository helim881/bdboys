"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
export async function registerUserAction(formData: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (existingUser)
      return { success: false, error: "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত" };

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "রেজিস্ট্রেশন ব্যর্থ হয়েছে" };
  }
}

export async function updateUserAction(formData: any, userId: string) {
  try {
    let imageUrl = formData.image;

    // 1. Image Upload Logic
    if (formData.image && formData.image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(formData.image, {
        folder: "user_profiles",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // 2. Prepare Data Object (নতুন অতিরিক্ত তথ্য সহ)
    const updateData: any = {
      name: formData.name,
      role: formData.role,
      image: imageUrl,

      gender: formData.gender,
      location: formData.location,
      about: formData.about,
    };

    // ৩. পাসওয়ার্ড আপডেট লজিক
    if (formData.password) {
      updateData.password = await bcrypt.hash(formData.password, 10);
    }

    // ৪. ডাটাবেস আপডেট
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // ৫. ক্যাশ ক্লিয়ার করা যাতে সাথে সাথে আপডেট দেখা যায়
    revalidatePath(`/profile/${userId}`);
    revalidatePath(`/profile`); // প্রোফাইল পেজ যদি ডাইনামিক হয়

    return { success: true };
  } catch (error) {
    console.error("USER_UPDATE_ACTION_ERROR:", error);
    return { success: false, error: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" };
  }
}
