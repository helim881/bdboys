import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ProfilePage from "../tabs";

// Next.js App Router-এ params প্রপস হিসেবে আসে
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: any) {
  const { id } = params;
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

  // ৩. ইউজার না পাওয়া গেলে 404 পেজ দেখাবে
  if (!user) {
    notFound();
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ProfilePage user={user} />
    </div>
  );
}
