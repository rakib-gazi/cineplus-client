import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BrandedCategory } from "@/models/BrandedCategory";
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

    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const nameTrimmed = name.trim();

    // Check if another category has the same name
    const existing = await BrandedCategory.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${nameTrimmed}$`, "i"),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Another category already exists with that name" },
        { status: 400 }
      );
    }

    const updatedCategory = await BrandedCategory.findByIdAndUpdate(
      id,
      { name: nameTrimmed },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    console.error("PUT Branded Category Error:", error);
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

    // Check if category has any associated brands before deleting
    const associatedBrands = await BrandedBrand.countDocuments({ category: id });
    if (associatedBrands > 0) {
      return NextResponse.json(
        { error: "Cannot delete category: it has associated brands. Please reassign or delete the brands first." },
        { status: 400 }
      );
    }

    const deletedCategory = await BrandedCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Branded Category Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
