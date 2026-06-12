import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ShowContent } from "@/models/ShowContent";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const shows = await ShowContent.find({ homepageStatus: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: shows });
  } catch (error: any) {
    console.error("GET Homepage Shows Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
