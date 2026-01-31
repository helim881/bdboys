import prisma from "@/lib/db";
import { UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;
    const body = await request.json();

    // Destructure all possible fields from the request body
    const { name, email, role, status, password, username } = body;

    // Create a dynamic data object for Prisma
    const updateData: any = {};

    // 1. Handle Basic Fields
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (username) updateData.username = username;

    // 2. Handle Enums (ensure consistency with database casing)
    if (role) updateData.role = role.toUpperCase() as UserRole;
    if (status) updateData.status = status.toUpperCase() as UserStatus;

    // 3. Handle Password Security
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 },
        );
      }
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Remove the password from the response for security
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Update Error:", error);

    // Handle P2002 (Unique constraint failed - e.g., email already exists)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or Username already taken" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE USER
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
