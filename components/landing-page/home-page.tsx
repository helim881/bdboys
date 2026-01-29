import prisma from "@/lib/db";
import { Metadata } from "next";
import RecentPost from "../recentpost";
import CategoryWithPost from "./categoryWithPost";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch global settings (id: 1 is your admin settings row)
  const settings = await prisma.setting.findFirst({
    where: { id: 1 },
  });

  // Fetch count of categories for dynamic description
  const categoryCount = await prisma.category.count({
    where: { type: "POST" },
  });

  const siteName = settings?.siteName || "BDBOYS.top";

  return {
    title: `Post Portal - ${siteName}`,
    description:
      settings?.description ||
      `Explore articles across ${categoryCount} categories on ${siteName}.`,
    keywords: settings?.keywords,
    openGraph: {
      title: `Post Portal | ${siteName}`,
      description: settings?.description,
      images: settings?.siteLogo ? [settings.siteLogo] : [],
    },
  };
}
export default async function PostPortal() {
  const categoriesWithPosts = await prisma.category.findMany({
    where: { type: "POST" },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        include: { author: { select: { name: true } } },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return (
    <main className="   py-6  space-y-8">
      {categoriesWithPosts.map((category) => (
        <CategoryWithPost category={category} />
      ))}
      <RecentPost />
    </main>
  );
}
