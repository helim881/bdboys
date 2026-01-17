// app/dashboard/page.jsx
import prisma from "@/lib/db"; // Adjust path to your prisma client
import StatsOverview from "./components/statusView";

async function getStats() {
  const [totalPosts, totalUsers, pendingPosts, totalSms] = await Promise.all([
    prisma.post.count(),
    prisma.user.count(),
    prisma.post.count({
      where: { status: "PENDING" }, // Matches your PostStatus enum
    }),
    prisma.sms.count(),
  ]);

  return { totalPosts, totalUsers, pendingPosts, totalSms };
}

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <StatsOverview data={stats} />
    </div>
  );
}
