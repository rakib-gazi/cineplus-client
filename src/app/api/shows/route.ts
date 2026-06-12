import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ShowContent } from "@/models/ShowContent";
import { verifyToken } from "@/lib/auth";

// GET /api/shows - Get all shows (sorted by newest)
export async function GET() {
  try {
    await dbConnect();
    const shows = await ShowContent.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: shows });
  } catch (error: any) {
    console.error("GET Shows Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/shows - Create new show (Protected)
export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { 
      title, dramaType, showDramaType, shortDescription, 
      awardWinnerCategory, awardGivenInstitution, showAwards, 
      imdbScore, showImdbScore, link, image, homepageStatus 
    } = body;

    if (!title || !shortDescription || !link || !image) {
      return NextResponse.json(
        { error: "Title, description, link, and image are required" },
        { status: 400 }
      );
    }

    const newShow = await ShowContent.create({
      title,
      dramaType: dramaType || "",
      showDramaType: !!showDramaType,
      shortDescription,
      awardWinnerCategory: awardWinnerCategory || "",
      awardGivenInstitution: awardGivenInstitution || "",
      showAwards: !!showAwards,
      imdbScore: imdbScore || "",
      showImdbScore: !!showImdbScore,
      link,
      image,
      homepageStatus: !!homepageStatus,
    });

    return NextResponse.json({ success: true, data: newShow });
  } catch (error: any) {
    console.error("POST Show Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
