import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SisterChannel } from "@/models/SisterChannel";
import { verifyToken } from "@/lib/auth";

// GET /api/sister-channels - Get all sister channels (sorted by oldest/createdAt asc so initial order is preserved)
export async function GET() {
  try {
    await dbConnect();
    const channels = await SisterChannel.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: channels });
  } catch (error: any) {
    console.error("GET Sister Channels Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/sister-channels - Create new sister channel (Protected)
export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { logo, title, subscriber, link } = await req.json();

    if (!logo || !title || !subscriber || !link) {
      return NextResponse.json(
        { error: "Logo, title, subscriber, and link are required" },
        { status: 400 }
      );
    }

    const newChannel = await SisterChannel.create({
      logo,
      title,
      subscriber,
      link,
    });

    return NextResponse.json({ success: true, data: newChannel });
  } catch (error: any) {
    console.error("POST Sister Channel Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
