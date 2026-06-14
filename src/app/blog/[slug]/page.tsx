import { dbConnect } from "@/lib/db";
export const dynamic = "force-dynamic";
import { BlogPost } from "@/models/BlogPost";
import BlogDetailsClient from "@/components/BlogDetailsClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { generateUniqueSlug } from "@/lib/slug";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await dbConnect();
    
    let blog = null;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    
    if (isValidObjectId) {
      blog = await BlogPost.findById(slug);
    } else {
      blog = await BlogPost.findOne({ slug });
    }
    
    if (!blog) {
      return { title: "Article Not Found" };
    }
    
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
  const { slug } = await params;
  await dbConnect();
  
  let blog = null;
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  
  if (isValidObjectId) {
    blog = await BlogPost.findById(slug);
    if (blog) {
      if (!blog.slug) {
        blog.slug = await generateUniqueSlug(blog.title, blog._id.toString());
        await blog.save();
      }
      redirect(`/blog/${blog.slug}`);
    }
  } else {
    blog = await BlogPost.findOne({ slug });
  }

  if (!blog) {
    redirect("/blog");
  }

  return <BlogDetailsClient id={slug} />;
}
