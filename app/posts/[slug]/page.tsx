import { authOptions } from "@/app/api/auth/option";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PostClientView from "./components/post-client";

// ১. ডাইনামিক মেটাডেটা জেনারেশন (SEO-র জন্য)
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ slug: slug }, { slug: params.slug }],
    },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title}`,
    description: post.content || post.title,
    openGraph: {
      title: post.title,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findFirst({
    where: {
      OR: [{ slug: decodedSlug }, { slug: params.slug }],
    },
    include: {
      category: true,
      subCategory: true,
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  // 1. Fetch Total Posts and Total Views
  // You can wrap these in a Promise.all for better performance
  const [totalPosts, viewsAggregate] = await Promise.all([
    prisma.post.count(), // Total number of articles
    prisma.post.aggregate({
      _sum: {
        views: true, // Sum of all 'views' columns
      },
    }),
  ]);

  const totalViews = viewsAggregate._sum.views || 0;

  // 2. Update View Count (Background)
  try {
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("View count update failed", error);
  }

  // Pass these stats to your Client Component
  return (
    <PostClientView
      post={post}
      stats={{ totalPosts, totalViews }}
      user={session?.user}
    />
  );
}
