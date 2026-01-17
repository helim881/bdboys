"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

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
