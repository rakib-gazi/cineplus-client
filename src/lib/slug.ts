import { BlogPost } from "@/models/BlogPost";

/**
 * Converts a string into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Generates a unique slug for a BlogPost based on the title.
 * Checks the database and appends a counter if there are duplicate slugs.
 */
export async function generateUniqueSlug(title: string, currentId?: string): Promise<string> {
  const baseSlug = slugify(title) || "blog-post";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: any = { slug };
    if (currentId) {
      query._id = { $ne: currentId };
    }

    const existing = await BlogPost.findOne(query);
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
