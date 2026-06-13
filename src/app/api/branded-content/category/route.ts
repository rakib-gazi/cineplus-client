import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BrandedCategory } from "@/models/BrandedCategory";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const categories = await BrandedCategory.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("GET Branded Categories Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const nameTrimmed = name.trim();

    // Check if category already exists
    const existing = await BrandedCategory.findOne({ name: new RegExp(`^${nameTrimmed}$`, "i") });
    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = await BrandedCategory.create({
      name: nameTrimmed,
    });

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error: any) {
    console.error("POST Branded Category Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
