import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { HeroContent } from "@/models/HeroContent";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const activeHero = await HeroContent.findOne({ currentActiveOnLiveSite: true });

    return NextResponse.json({
      success: true,
      active: !!activeHero,
      data: activeHero || null
    });
  } catch (error: any) {
    console.error("GET Active Hero Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
