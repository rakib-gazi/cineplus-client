import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { GalleryItem } from "@/models/GalleryItem";
import { verifyToken } from "@/lib/auth";

// GET /api/gallery - Fetch all gallery items (ordered chronologically/asc)
export async function GET() {
  try {
    await dbConnect();
    const items = await GalleryItem.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error("GET Gallery Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/gallery - Add single or multiple gallery items (Protected)
export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    if (body.urls && Array.isArray(body.urls)) {
      // Bulk insert
      if (body.urls.length === 0) {
        return NextResponse.json({ error: "URLs array cannot be empty" }, { status: 400 });
      }

      const documents = body.urls.map((url: string) => ({ url }));
      const inserted = await GalleryItem.insertMany(documents);
      return NextResponse.json({ success: true, data: inserted });
    } else if (body.url) {
      // Single insert
      const created = await GalleryItem.create({ url: body.url });
      return NextResponse.json({ success: true, data: created });
    } else {
      return NextResponse.json({ error: "URL or URLs array is required" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("POST Gallery Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
