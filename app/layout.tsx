import prisma, { getSiteSettings } from "@/lib/db";
import AuthProvider from "@/provider/auth.provicer";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./assets/scss/globals.scss";

/* -----------------------------
   ✅ Font Configuration
----------------------------- */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
// app/layout.tsx
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import type { Metadata } from "next";
import "./assets/scss/globals.scss";

// app/layout.tsx

export async function generateMetadata(): Promise<Metadata> {
  // Fetch global settings (id: 1 is your admin settings row)
  const settings = await prisma.setting.findFirst({
    where: { id: 1 },
  });

  // Fetch count of categories for dynamic description
  const categoryCount = await prisma.category.count({
    where: { type: "POST" },
  });

  const siteName = settings?.siteName || "BDBOYS.top";

  return {
    title: `Post Portal - ${siteName}`,
    description:
      settings?.description ||
      `Explore articles across ${categoryCount} categories on ${siteName}.`,
    keywords: settings?.keywords,
    openGraph: {
      title: `Post Portal | ${siteName}`,
      description: settings?.description,
      images: settings?.siteLogo ? [settings.siteLogo] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <html
      lang="en"
      prefix="og: https://ogp.me/ns#"
      suppressHydrationWarning
      className={poppins.variable}
    >
      <head>
        {/* Progressive Web App (PWA) Setup */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <AuthProvider>
        <body className={`${poppins.className}  `}>
          <main className="container">
            <Header logo={settings?.siteLogo} siteName={settings?.siteName} />
            {children}
            <Footer logo={settings?.siteLogo} siteName={settings?.siteName} />
          </main>

          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
