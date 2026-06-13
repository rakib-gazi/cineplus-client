import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { PartnerInquiry } from "@/models/PartnerInquiry";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const inquiries = await PartnerInquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    console.error("GET Partner Inquiries Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, phone, email, institution, message } = await req.json();

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Name, phone, email, and message are required fields" },
        { status: 400 }
      );
    }

    const newInquiry = await PartnerInquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      institution: institution ? institution.trim() : undefined,
      message: message.trim(),
    });

    return NextResponse.json({ success: true, data: newInquiry });
  } catch (error: any) {
    console.error("POST Partner Inquiry Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
