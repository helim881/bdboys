import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import PostClientView from "./components/post-client";

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      subCategory: true,
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Increment view count (optional but recommended)
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div>
      <Breadcrumb />
      <PostClientView post={post} />
    </div>
  );
}
