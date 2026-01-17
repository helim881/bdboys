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
import type { Metadata } from "next";
import "./assets/scss/globals.scss";

// app/layout.tsx

export const metadata: Metadata = {
  title: {
    default: "Bdboys | Best SMS, Love Quotes & Latest News",
    template: "%s | Bdboys",
  },
  description:
    "Discover the best collection of Bengali SMS, Love Quotes, Status updates, and the latest trending news on Bdboys.",

  applicationName: "Bdboys",
  keywords: [
    "Bengali SMS",
    "Love SMS",
    "Valobashar Status",
    "Bangla News",
    "Social Media Status",
    "Bangla Quotes",
    "Bdboys posts",
  ],

  // Favicon & Icons
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },

  // Open Graph (Social Media Sharing)
  openGraph: {
    type: "website",
    url: "https://bdboys.site", // Updated to reflect your branding
    title: "Bdboys — Ultimate Bangla SMS & News Portal",
    description:
      "Find the perfect SMS for your loved ones and stay updated with trending news.",
    siteName: "Bdboys",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bdboys - SMS and News Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bdboys — Best SMS & News",
    description:
      "Get the latest Bengali SMS, love quotes, and daily news updates.",
    images: ["/og-image.png"],
  },

  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            {/* <Header /> */}
            {children}
          </main>

          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
