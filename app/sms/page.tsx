import Breadcrumb from "@/components/breadcumb";
import ErrorPage from "@/components/error/error";
import RecentPost from "@/components/recentpost";
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

  return (
    <div className="container pt-4">
      <Breadcrumb />

      {categoriesWithSms.map((cat) => (
        <SmsSection key={cat.id} cat={cat} />
      ))}

      <RecentPost />
    </div>
  );
}
