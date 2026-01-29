import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SubcategoryWithPost from "../components/subcategoryWithPost";

// এই লাইনটি নিশ্চিত করবে যে প্রতিবার রিকোয়েস্টে নতুন ডাটা আসবে
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);

  const category = await prisma.category.findFirst({
    where: {
      OR: [{ slug: slug }, { slug: params.slug }],
    },
  });

  if (!category) {
    return { title: "Category Not Found | BDBOYS" };
  }

  return {
    title: `${category.name} | BDBOYS`,
    description: category.description || `${category.name} সম্পর্কিত সকল খবর।`,
  };
}

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
            // অথর বা অন্য ডাটা লাগলে এখানে ইনক্লুড করতে পারেন
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

      <header className="mb-10 border-b-4 border-[#003366] pb-2">
        <h1 className="text-3xl font-bold text-[#003366]">{category.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {category.description || `${category.name} সম্পর্কিত সকল খবর`}
        </p>
      </header>

      <div className="space-y-12">
        {category.subCategories.length > 0 ? (
          category.subCategories.map((sub) => (
            <SubcategoryWithPost key={sub.id} category={sub} slug={slug} />
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">
            কোনো সাব-ক্যাটাগরি পাওয়া যায়নি।
          </p>
        )}
      </div>
    </main>
  );
}
