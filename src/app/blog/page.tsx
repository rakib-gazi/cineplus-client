import BlogClient from "@/components/BlogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore the latest stories, news, and behind-the-scenes blogs from Cineplus Studio. Get exclusive updates on web series, cast interviews, and production logs.",
};

export default function Page() {
  return <BlogClient />;
}
