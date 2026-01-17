import prisma from "@/lib/db";
import { UserRole, UserStatus } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
// UPDATE USER (Role or Status)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { role, status } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // Only update if the field is provided in the body
        ...(role && { role: role.toUpperCase() as UserRole }),
        ...(status && { status: status.toUpperCase() as UserStatus }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
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
