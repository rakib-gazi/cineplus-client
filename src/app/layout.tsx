import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Cineplus Studio",
    template: "%s | Cineplus Studio",
  },
  description:
    "Cineplus Studio is a premier digital storytelling powerhouse. We deliver gripping original series, youth-centric dramas, and family comedy shows.",
  keywords:
    "Cineplus, Cineplus Studio, shows, brand, series, originals, drama, comedy, panchayat, gullak, kota factory, web series, partner",
  openGraph: {
    title: "Cineplus Studio",
    description:
      "Cineplus Studio is a premier digital storytelling powerhouse.",
    siteName: "Cineplus Studio",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cineplus Studio",
    description:
      "Cineplus Studio is a premier digital storytelling powerhouse.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
