import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        createdAt: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email || "No Email",
      role: user.role.toLowerCase(), // admin, editor, etc.
      status: user.status.toLowerCase(), // active, pending, suspended
      avatar: user.image,
      posts: user._count.posts,
      joined: new Date(user.createdAt).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
      }),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("User Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
