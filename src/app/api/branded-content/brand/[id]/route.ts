import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BrandedBrand } from "@/models/BrandedBrand";
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

    const { name, logo, category } = await req.json();

    if (!name || !logo || !category) {
      return NextResponse.json(
        { error: "Brand name, logo, and category are required" },
        { status: 400 }
      );
    }

    const updatedBrand = await BrandedBrand.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        logo,
        category,
      },
      { new: true }
    ).populate("category", "name");

    if (!updatedBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBrand });
  } catch (error: any) {
    console.error("PUT Branded Brand Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const deletedBrand = await BrandedBrand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Branded Brand Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
