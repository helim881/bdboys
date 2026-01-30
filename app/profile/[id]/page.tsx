import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ProfilePage from "../tabs";

// 1. Properly define the Params type
interface PageProps {
  params: Promise<{ id: string }>; // In Next.js 15, params is a Promise
}

export default async function Page({ params }: PageProps) {
  // 2. Await params before destructuring
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) notFound();

  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      _count: {
        select: {
          posts: true,
          sms: true,
        },
      },
      sms: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
        },
      },
      posts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // 3. Ensure ProfilePage isn't trying to render the whole user object
  // into a <span> or <div> inside its own code.
  return (
    <div className="bg-gray-100 min-h-screen">
      <ProfilePage user={user} />
    </div>
  );
}
