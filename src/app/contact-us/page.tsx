import ContactUsClient from "@/components/ContactUsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Cineplus Studio in Mohammadpur, Dhaka. Pitch your scripts, send business inquiries, or explore career opportunities with us.",
};

export default function Page() {
  return <ContactUsClient />;
}
