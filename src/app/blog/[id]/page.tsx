import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import BlogDetailsClient from "@/components/BlogDetailsClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    await dbConnect();
    const blog = await BlogPost.findById(id);
    if (!blog) {
      return { title: "Article Not Found" };
    }
    // Clean snippet for description
    const snippet = blog.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
    return {
      title: blog.title,
      description: snippet,
    };
  } catch (err) {
    return { title: "Blog Article" };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogDetailsClient id={id} />;
}
