import Breadcrumb from "@/components/breadcumb";
import RecentPost from "@/components/recentpost";
import prisma from "@/lib/db";
import { Metadata } from "next";
import SmsSection from "./components/sms-section";
export const metadata: Metadata = {
  title: "SMS Zone - Best Collection of Bangla SMS | BDBOYS.top",
  description:
    "Explore thousands of Bangla SMS, status, and quotes across various categories like Love, Friendship, and Islamic SMS.",
  keywords: [
    "Bangla SMS",
    "Sms Zone",
    "Status Bangla",
    "BDBOYS",
    "Mobile Tunes",
  ],
  openGraph: {
    title: "SMS Zone - BDBOYS.top",
    description: "The ultimate collection of Bangla SMS and Status.",
    url: "https://bdboys.top/sms-zone",
    siteName: "BDBOYS.top",
    images: [
      {
        url: "/og-sms-zone.png", // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
};
export default async function SmsZonePage() {
  const categoriesWithSms = await prisma.category.findMany({
    where: { type: "SMS" },
    include: {
      sms: {
        where: { status: "PUBLISHED" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true } } },
      },
    },
  });
  return (
    <div className=" container pt-4">
      {/* Breadcrumb matching image_191441.png */}
      <div className="bg-[#E9F1F7] p-2 mb-4 border border-[#B8D1E5]">
        <Breadcrumb />
      </div>

      {categoriesWithSms.map((cat) => (
        <SmsSection key={cat.id} cat={cat} />
      ))}
      <RecentPost />
    </div>
  );
}
