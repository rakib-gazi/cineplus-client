import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { HeroContent } from "@/models/HeroContent";
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

    const { tag, title, shortDescription, link, currentActiveOnLiveSite } = await req.json();

    if (!tag || !title || !shortDescription || !link) {
      return NextResponse.json(
        { error: "Tag, title, description, and link are required" },
        { status: 400 }
      );
    }

    // If setting active, deactivate all other contents first
    if (currentActiveOnLiveSite) {
      await HeroContent.updateMany({ _id: { $ne: id } }, { currentActiveOnLiveSite: false });
    }

    const updatedHero = await HeroContent.findByIdAndUpdate(
      id,
      {
        tag,
        title,
        shortDescription,
        link,
        currentActiveOnLiveSite: !!currentActiveOnLiveSite,
      },
      { new: true }
    );

    if (!updatedHero) {
      return NextResponse.json({ error: "Hero content not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedHero });
  } catch (error: any) {
    console.error("PUT Hero Content Error:", error);
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

    const deletedHero = await HeroContent.findByIdAndDelete(id);

    if (!deletedHero) {
      return NextResponse.json({ error: "Hero content not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Hero content deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Hero Content Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
