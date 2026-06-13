import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { PartnerInquiry } from "@/models/PartnerInquiry";
import { verifyToken } from "@/lib/auth";

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

    const deletedInquiry = await PartnerInquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return NextResponse.json(
        { error: "Partner inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Partner inquiry deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Partner Inquiry Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
