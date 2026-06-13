import BrandedContentClient from "@/components/BrandedContentClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branded Content",
  description:
    "Empower your brand through organic integration. Explore how Cineplus Studio collaborates with global partners to weave impactful stories.",
};

export default function Page() {
  return <BrandedContentClient />;
}
