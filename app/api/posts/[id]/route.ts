import { NextResponse } from "next/server";

import prisma from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const slug = params.id;

    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        subCategory: true,
        author: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const postCount = await prisma.post.count({
      where: { authorId: post?.authorId },
    });
    const totalViewsByAuthor = await prisma.post.aggregate({
      where: { authorId: post.authorId },
      _sum: { views: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: post,
        stats: { postCount, totalViewsByAuthor },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_POST_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // Replace this with your actual database logic
    await prisma.post.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE_POST_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
