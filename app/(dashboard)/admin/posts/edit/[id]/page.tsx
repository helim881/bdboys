import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditPost from "./components/edit-post";

export default async function Page({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6">
      <EditPost post={post} />
    </div>
  );
}
