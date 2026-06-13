import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const blog = await BlogPost.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error("GET Blog ID Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const { banner, title, blogdate, content } = await req.json();

    if (!banner || !title || !content) {
      return NextResponse.json(
        { error: "Banner, title, and content are required" },
        { status: 400 }
      );
    }

    const updatedBlog = await BlogPost.findByIdAndUpdate(
      id,
      {
        banner,
        title,
        blogdate: blogdate ? new Date(blogdate) : new Date(),
        content,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedBlog });
  } catch (error: any) {
    console.error("PUT Blog Error:", error);
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

    const deletedBlog = await BlogPost.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Blog Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
