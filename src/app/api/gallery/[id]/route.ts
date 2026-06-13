import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { GalleryItem } from "@/models/GalleryItem";
import { verifyToken } from "@/lib/auth";

// DELETE /api/gallery/[id] - Delete a poster item by ID (Protected)
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

    const deletedItem = await GalleryItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Gallery Item Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
