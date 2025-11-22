// src/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

export function getPostSlugs() {
  if (!fs.existsSync(POSTS_PATH)) return [];
  return fs.readdirSync(POSTS_PATH).filter((f) => f.endsWith(".md"));
}

/**
 * Accepts slug that may be string | string[] | undefined.
 * Returns null if the post file doesn't exist.
 */
export function getPostBySlug(slug: string | string[] | undefined) {
  // normalize slug param
  const slugStr = Array.isArray(slug) ? slug[0] : slug || "";
  const realSlug = slugStr.replace(/\.md$/, "");

  if (!realSlug) return null;

  const fullPath = path.join(POSTS_PATH, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);

  return {
    slug: realSlug,
    meta: data as { title: string; date: string; excerpt?: string },
    content,
  };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug)!).filter(Boolean);
  posts.sort((a: any, b: any) => (a.meta.date < b.meta.date ? 1 : -1));
  return posts;
}
