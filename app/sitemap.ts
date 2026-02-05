import prisma from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bdboys.top";

  // ১. ডাটাবেস থেকে সব পোস্টের লিঙ্ক আনা
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
  });

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ২. ডাটাবেস থেকে সব ক্যাটাগরির লিঙ্ক আনা
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ৩. স্ট্যাটিক পেজগুলো (Home, About, etc.)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticPages, ...categoryEntries, ...postEntries];
}
