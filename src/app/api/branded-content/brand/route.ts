import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BrandedBrand } from "@/models/BrandedBrand";
import { verifyToken } from "@/lib/auth";

// GET /api/branded-content/brand - Retrieve all brands
export async function GET() {
  try {
    await dbConnect();
    const brands = await BrandedBrand.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: brands });
  } catch (error: any) {
    console.error("GET Branded Brands Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/branded-content/brand - Create a new brand related to a category
export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { name, logo, category } = await req.json();

    if (!name || !logo || !category) {
      return NextResponse.json(
        { error: "Brand name, logo, and category are required" },
        { status: 400 }
      );
    }

    const newBrand = await BrandedBrand.create({
      name: name.trim(),
      logo,
      category,
    });

    const populatedBrand = await BrandedBrand.findById(newBrand._id).populate("category", "name");

    return NextResponse.json({ success: true, data: populatedBrand });
  } catch (error: any) {
    console.error("POST Branded Brand Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
