import Breadcrumb from "@/components/breadcumb";
import ErrorPage from "@/components/error/error";
import RecentPost from "@/components/recentpost";
import { Metadata } from "next";
import Link from "next/link";
import SmsCard from "./components/sms-card";
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
        url: "/og-sms-zone.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
};

type Sms = {
  id: string;
  title: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sms: Sms[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export default async function SmsZonePage() {
  let categoriesWithSms: Category[] = [];
  let popularSms: Category[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sms`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch SMS categories");

    const result: ApiResponse<Category[]> = await res.json();

    categoriesWithSms = result.data;
  } catch (error) {
    console.error("SMS_CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/popular`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch SMS categories");

    const result: ApiResponse<Category[]> = await res.json();

    popularSms = result.data;
  } catch (error) {
    console.error("SMS_CATEGORY_FETCH_ERROR:", error);
    return <ErrorPage />;
  }

  return (
    <div className="container pt-4">
      <Breadcrumb />
      <section className="mb-6 bg-white border border-[#B8D1E5] rounded-sm shadow-sm">
        {/* Header Bar */}
        <div className="bg-[#E9F1F7] px-3 py-1.5 flex justify-between items-center border-b border-[#B8D1E5]">
          <h2 className="text-sm font-bold text-[#333]">Popular Sms</h2>
          <Link
            href={`/sms/popular`}
            className="text-[11px] font-bold text-red-800 hover:underline"
          >
            আরও
          </Link>
        </div>
        {popularSms?.length > 0 &&
          popularSms.map((sms) => <SmsCard key={sms.id} sms={sms} />)}
      </section>
      {categoriesWithSms.map((cat) => (
        <SmsSection key={cat.id} cat={cat} />
      ))}

      <RecentPost />
    </div>
  );
}
