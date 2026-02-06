import { NotFound } from "@/components/not-found";
import prisma from "@/lib/db";
import { Metadata } from "next";
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
  const slug = decodeURIComponent(params.slug);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${slug}`,
    { cache: "no-store" },
  );
  const post = await res.json();

  if (!post) {
    return <NotFound />;
  }

  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
    include: {
      author: true,
      category: true,
      subCategory: true,
    },
  });

  // Pass these stats to your Client Component
  return <PostClientView post={post?.data} stats={post?.stats} />;
}
