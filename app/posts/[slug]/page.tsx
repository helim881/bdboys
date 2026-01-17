import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { Metadata } from "next";
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
  // ২. স্লাগ ডিকোড করা (বাংলার জন্য অপরিহার্য)
  const decodedSlug = decodeURIComponent(params.slug);

  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug: decodedSlug }, // বাংলা স্লাগ
        { slug: params.slug }, // ইংরেজি বা এনকোডেড স্লাগ
      ],
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

  // ৩. ভিউ কাউন্ট আপডেট (ব্যাকগ্রাউন্ডে করা ভালো)
  try {
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("View count update failed", error);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb />
      <PostClientView post={post} />
    </div>
  );
}
