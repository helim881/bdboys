import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SubcategoryWithPost from "../components/subcategoryWithPost";

// ১. মেটাডেটা জেনারেটর ফাংশন
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);

  const category = await prisma.category.findFirst({
    where: {
      type: "SMS",
      OR: [{ slug: slug }, { slug: params.slug }],
    },
  });

  if (!category) {
    return {
      title: "Category Not Found | BDBOYS",
    };
  }

  return {
    title: `${category.name} `,
    description:
      category.description || `${category.name} সম্পর্কিত সকল খবর এবং পোস্ট।`,
    openGraph: {
      title: `${category.name} - BDBOYS`,
      description:
        category.description || `${category.name} ক্যাটেগরির পোস্টসমূহ।`,
      type: "website",
    },
    // যদি ক্যাটেগরির জন্য কোনো ইমেজ থাকে তবে সেটি এখানে দিতে পারেন
  };
}

// ২. মূল পেজ কম্পোনেন্ট
export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  const category = await prisma.category.findFirst({
    where: {
      OR: [{ slug: slug }, { slug: params.slug }],
    },
    include: {
      subCategories: {
        include: {
          posts: {
            where: { status: "PUBLISHED" },
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="mb-10 border-b-4 border-[#003366] pb-2">
        <h1 className="text-3xl font-bold text-[#003366]">{category.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {category.description || `${category.name} সম্পর্কিত সকল খবর`}
        </p>
      </div>

      <div className="space-y-12">
        {category.subCategories.map((sub) => (
          <SubcategoryWithPost key={sub.id} category={sub} />
        ))}
      </div>
    </main>
  );
}
