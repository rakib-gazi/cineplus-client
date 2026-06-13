import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { verifyToken } from "@/lib/auth";

// GET /api/blog - Get all blog posts (sorted by blogdate descending / newest first)
export async function GET() {
  try {
    await dbConnect();
    const blogs = await BlogPost.find({}).sort({ blogdate: -1 });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/blog - Create new blog post (Protected)
export async function POST(req: NextRequest) {
  try {
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { banner, title, blogdate, content } = await req.json();

    if (!banner || !title || !content) {
      return NextResponse.json(
        { error: "Banner, title, and content are required" },
        { status: 400 }
      );
    }

    const newBlog = await BlogPost.create({
      banner,
      title,
      blogdate: blogdate ? new Date(blogdate) : new Date(),
      content,
    });

    return NextResponse.json({ success: true, data: newBlog });
  } catch (error: any) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
