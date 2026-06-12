import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { HeroContent } from "@/models/HeroContent";
import { verifyToken } from "@/lib/auth";

// GET /api/hero - Get all hero contents (sorted by newest)
export async function GET() {
  try {
    await dbConnect();
    const contents = await HeroContent.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contents });
  } catch (error: any) {
    console.error("GET Hero Content Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/hero - Create new hero content (Protected)
export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { tag, title, shortDescription, link, currentActiveOnLiveSite } = await req.json();

    if (!tag || !title || !shortDescription || !link) {
      return NextResponse.json(
        { error: "Tag, title, description, and link are required" },
        { status: 400 }
      );
    }

    // If active, deactivate other active contents first
    if (currentActiveOnLiveSite) {
      await HeroContent.updateMany({}, { currentActiveOnLiveSite: false });
    }

    const newHero = await HeroContent.create({
      tag,
      title,
      shortDescription,
      link,
      currentActiveOnLiveSite: !!currentActiveOnLiveSite,
    });

    return NextResponse.json({ success: true, data: newHero });
  } catch (error: any) {
    console.error("POST Hero Content Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
