import prisma from "@/lib/db";
import CategoryWithPost from "./categoryWithPost";
export default async function PostPortal() {
  const categoriesWithPosts = await prisma.category.findMany({
    where: { type: "POST" },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
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
    </main>
  );
}
