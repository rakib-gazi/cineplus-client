import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { verifyToken } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    let blog = null;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isValidObjectId) {
      blog = await BlogPost.findById(id);
    }
    
    if (!blog) {
      blog = await BlogPost.findOne({ slug: id });
    }
    
    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Auto-generate slug on the fly if it is missing (lazy migration)
    if (!blog.slug) {
      blog.slug = await generateUniqueSlug(blog.title, blog._id.toString());
      await blog.save();
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

    const existingBlog = await BlogPost.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Regenerate slug if title changes or slug is missing
    let slug = existingBlog.slug;
    if (!slug || existingBlog.title !== title) {
      slug = await generateUniqueSlug(title, id);
    }

    const updatedBlog = await BlogPost.findByIdAndUpdate(
      id,
      {
        banner,
        title,
        slug,
        blogdate: blogdate ? new Date(blogdate) : new Date(),
        content,
      },
      { new: true }
    );

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
