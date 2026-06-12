import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Cine Plus Studio",
  description:
    "The Viral Fever (TVF) is one of India's most popular and critically acclaimed content brands. Since its inception in 2012, TVF has consistently delivered original content that breaks stereotypes and resonates with millions, striking a balance between youth-centric storytelling and family-friendly entertainment.",
  keywords:
    "TVF, viral fever, shows, brand, the timeliners, the screen patti, girliyapa, panchayat, gullak, kota factory, sketches, reels, partnerships",
  openGraph: {
    title: "Cine Plus Studio",
    description:
      "The Viral Fever (TVF) is one of India's most popular and critically acclaimed content brands.",
    siteName: "The Viral Fever",
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
    title: "Cine Plus Studio",
    description:
      "The Viral Fever (TVF) is one of India's most popular and critically acclaimed content brands.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
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
