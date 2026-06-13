import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/lib/auth";
import { dbConnect } from "@/lib/db";

// Import models
import { ShowContent } from "@/models/ShowContent";
import { SisterChannel } from "@/models/SisterChannel";
import { GalleryItem } from "@/models/GalleryItem";
import { BlogPost } from "@/models/BlogPost";
import { BrandedBrand } from "@/models/BrandedBrand";

function extractPublicId(url: string | undefined | null): string | null {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/tvf-clone\/([^.]+)/);
  if (match) {
    // Decode URI components in case spaces or special characters are encoded
    try {
      return `tvf-clone/${decodeURIComponent(match[1])}`;
    } catch {
      return `tvf-clone/${match[1]}`;
    }
  }
  return null;
}

function extractPublicIdsFromHtml(html: string | undefined | null): string[] {
  if (!html || typeof html !== "string") return [];
  const ids: string[] = [];
  // Match any src attribute in HTML tags
  const matches = html.matchAll(/src=["']([^"']+)["']/g);
  for (const match of matches) {
    const publicId = extractPublicId(match[1]);
    if (publicId) {
      ids.push(publicId);
    }
  }
  return ids;
}

// GET /api/unused-images - Retrieve all unused images from Cloudinary
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate admin
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate and configure Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // 3. Connect DB and fetch all image links from all models
    await dbConnect();

    const [shows, channels, gallery, blogs, brands] = await Promise.all([
      ShowContent.find({}, "image cast.image"),
      SisterChannel.find({}, "logo"),
      GalleryItem.find({}, "url"),
      BlogPost.find({}, "banner content"),
      BrandedBrand.find({}, "logo"),
    ]);

    // Gather all active public IDs
    const activePublicIds = new Set<string>();

    // Parse Shows
    shows.forEach((show) => {
      const showPid = extractPublicId(show.image);
      if (showPid) activePublicIds.add(showPid);

      if (show.cast && Array.isArray(show.cast)) {
        show.cast.forEach((c: any) => {
          const castPid = extractPublicId(c.image);
          if (castPid) activePublicIds.add(castPid);
        });
      }
    });

    // Parse Sister Channels
    channels.forEach((channel) => {
      const channelPid = extractPublicId(channel.logo);
      if (channelPid) activePublicIds.add(channelPid);
    });

    // Parse Gallery Items
    gallery.forEach((g) => {
      const galleryPid = extractPublicId(g.url);
      if (galleryPid) activePublicIds.add(galleryPid);
    });

    // Parse Blog Posts
    blogs.forEach((blog) => {
      const blogPid = extractPublicId(blog.banner);
      if (blogPid) activePublicIds.add(blogPid);

      const inlinePids = extractPublicIdsFromHtml(blog.content);
      inlinePids.forEach((pid) => activePublicIds.add(pid));
    });

    // Parse Branded Brands
    brands.forEach((brand) => {
      const brandPid = extractPublicId(brand.logo);
      if (brandPid) activePublicIds.add(brandPid);
    });

    // 4. Fetch all resources from Cloudinary folder 'tvf-clone'
    // Next.js runtime may throw errors on large folders if not paged, so we retrieve up to 500 resources
    const cloudinaryResponse = await cloudinary.api.resources({
      type: "upload",
      prefix: "tvf-clone/",
      max_results: 500,
    });

    const resources = cloudinaryResponse.resources || [];

    // Filter resources whose public_id is not in activePublicIds
    const unusedResources = resources.filter((res: any) => {
      return !activePublicIds.has(res.public_id);
    });

    return NextResponse.json({ success: true, data: unusedResources });
  } catch (error: any) {
    console.error("GET Unused Images Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/unused-images - Bulk delete images from Cloudinary
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin
    const admin = verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate and configure Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // 3. Parse request payload
    const { public_ids } = await req.json();

    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
      return NextResponse.json(
        { error: "An array of public_ids is required for deletion" },
        { status: 400 }
      );
    }

    // 4. Delete images in Cloudinary
    const deletionPromises = public_ids.map((public_id) =>
      cloudinary.uploader.destroy(public_id)
    );

    const deletionResults = await Promise.all(deletionPromises);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${public_ids.length} images from Cloudinary`,
      results: deletionResults,
    });
  } catch (error: any) {
    console.error("POST Unused Images Delete Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
