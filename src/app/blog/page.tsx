import BlogClient from "@/components/BlogClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";

export const metadata: Metadata = {
  title: "Blog | Cineplus Studio",
  description:
    "Explore the latest stories, news, and behind-the-scenes blogs from Cineplus Studio. Get exclusive updates on web series, cast interviews, and production logs.",
  keywords: "Cineplus, blog, updates, behind the scenes, production, stories",
};

export default async function Page() {
  await dbConnect();

  // Fetch blogs on the server, sorted by blogdate descending
  const rawBlogs = await BlogPost.find().sort({ blogdate: -1 }).lean();
  const serializableBlogs = rawBlogs.map((blog: any) => ({
    _id: blog._id.toString(),
    banner: blog.banner,
    title: blog.title,
    blogdate: blog.blogdate,
    content: blog.content,
    createdAt: blog.createdAt.toISOString(),
  }));

  return <BlogClient initialBlogs={serializableBlogs} />;
}
