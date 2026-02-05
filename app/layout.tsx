import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import prisma, { getSiteSettings } from "@/lib/db";
import AuthProvider from "@/provider/auth.provicer";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./assets/scss/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/* -----------------------------
    ✅ Dynamic Metadata Logic
----------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.setting.findFirst({ where: { id: 1 } });
  const categoryCount = await prisma.category.count({
    where: { type: "POST" },
  });

  const siteName = settings?.siteName || "BDBOYS.top";
  const description =
    settings?.description ||
    `Explore articles across ${categoryCount} categories.`;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: settings?.keywords || "sms, bangla, tunes",
    verification: {
      // Automatically parses and handles the google-site-verification tag
      google: settings?.googleMeta || undefined,
    },
    openGraph: {
      title: siteName,
      description: description,
      url: settings?.siteUrl || "https://bdboys.top",
      siteName: siteName,
      images: settings?.siteLogo ? [{ url: settings.siteLogo }] : [],
      type: "website",
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        {/* If site has a custom favicon in settings, use it, otherwise fallback */}
      </head>

      {/* Google Analytics (GA4) Injection */}
      {settings?.analyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.analyticsId}');
            `}
          </Script>
        </>
      )}

      <AuthProvider>
        <body className={poppins.className}>
          <main className="container">
            <Header logo={settings?.siteLogo} siteName={settings?.siteName} />
            {children}
            <Footer logo={settings?.siteLogo} siteName={settings?.siteName} />
          </main>
          <Toaster position="top-center" reverseOrder={false} />
        </body>
      </AuthProvider>
    </html>
  );
}
