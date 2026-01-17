import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import SubcategoryWithPost from "../components/subcategoryWithPost";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug },
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

      {/* Subcategories Loop */}
      <div className="space-y-12">
        {category.subCategories.map((sub) => (
          <SubcategoryWithPost category={sub} />
        ))}
      </div>
    </main>
  );
}
