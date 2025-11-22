// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { marked } from "marked";
import SEO from "@/lib/seo";

type Props = { params: { slug: string | string[] } };

// ensure Next pre-generates the slug routes
export function generateStaticParams() {
  return getPostSlugs().map((s) => ({ slug: s.replace(/\.md$/, "") }));
}

// NOTE: make this an async component and await params (params can be a Promise)
export default async function PostPage({ params }: Props) {
  // await the params object per Next.js sync-dynamic-apis requirement
  const resolvedParams = await params as { slug?: string | string[] };

  // DEBUG (temporary) - shows resolved params in terminal
  console.log("➡️ DEBUG RESOLVED PARAMS:", resolvedParams);

  const post = getPostBySlug(resolvedParams.slug);
  console.log("➡️ DEBUG POST:", post);

  if (!post) {
    // gracefully render 404 if post not found
    return notFound();
  }

  const html = marked(post.content);

  return (
    <>
      <SEO title={post.meta.title} desc={post.meta.excerpt} />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-extrabold">{post.meta.title}</h1>
          <div className="mt-4 text-slate-400 text-sm">{post.meta.date}</div>
          <div className="mt-8 prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    </>
  );
}
