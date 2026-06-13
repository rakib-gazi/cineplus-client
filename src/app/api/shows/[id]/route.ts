import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ShowContent } from "@/models/ShowContent";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const { 
      title, dramaType, showDramaType, shortDescription, 
      awardWinnerCategory, awardGivenInstitution, showAwards, 
      imdbScore, showImdbScore, link, image, homepageStatus,
      cast
    } = body;

    if (!title || !shortDescription || !link || !image) {
      return NextResponse.json(
        { error: "Title, description, link, and image are required" },
        { status: 400 }
      );
    }

    const updatedShow = await ShowContent.findByIdAndUpdate(
      id,
      {
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
        cast: cast || [],
      },
      { new: true }
    );

    if (!updatedShow) {
      return NextResponse.json({ error: "Show content not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedShow });
  } catch (error: any) {
    console.error("PUT Show Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const deletedShow = await ShowContent.findByIdAndDelete(id);

    if (!deletedShow) {
      return NextResponse.json({ error: "Show content not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Show content deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Show Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
