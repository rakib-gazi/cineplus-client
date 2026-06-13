import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Welcome to Cineplus Studio. We deliver gripping original web series, youth-centric dramas, and family comedy shows that break stereotypes and captivate audiences globally.",
};

export default function Page() {
  return <HomeClient />;
}
