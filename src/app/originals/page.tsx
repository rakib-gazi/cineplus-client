import OriginalsClient from "@/components/OriginalsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Originals",
  description:
    "Explore the premium original web series and dramas of Cineplus Studio. High-fidelity storytelling, award-winning cast, and premium production.",
};

export default function Page() {
  return <OriginalsClient />;
}
