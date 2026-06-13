import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SisterChannel } from "@/models/SisterChannel";
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

    const { logo, title, subscriber, link } = await req.json();

    if (!logo || !title || !subscriber || !link) {
      return NextResponse.json(
        { error: "Logo, title, subscriber, and link are required" },
        { status: 400 }
      );
    }

    const updatedChannel = await SisterChannel.findByIdAndUpdate(
      id,
      {
        logo,
        title,
        subscriber,
        link,
      },
      { new: true }
    );

    if (!updatedChannel) {
      return NextResponse.json({ error: "Sister channel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedChannel });
  } catch (error: any) {
    console.error("PUT Sister Channel Error:", error);
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

    const deletedChannel = await SisterChannel.findByIdAndDelete(id);

    if (!deletedChannel) {
      return NextResponse.json({ error: "Sister channel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Sister channel deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Sister Channel Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
