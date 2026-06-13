import AdminLoginClient from "@/components/AdminLoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description:
    "Secure control portal login for Cineplus Studio administration staff.",
};

export default function Page() {
  return <AdminLoginClient />;
}
