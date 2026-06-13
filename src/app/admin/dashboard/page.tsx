import AdminDashboardClient from "@/components/AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Secure administrative dashboard to control homepage elements, active hero banners, and the video library.",
};

export default function Page() {
  return <AdminDashboardClient />;
}
