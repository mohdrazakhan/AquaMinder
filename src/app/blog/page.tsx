// src/app/blog/page.tsx
import React from "react";
import Link from "next/link";
import SEO from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <SEO title="Blog" desc="Aqua Minder blog" />
      <section className="py-16">
        <div className="container">
          <h1 className="text-3xl font-extrabold">Blog</h1>
          <div className="mt-8 grid gap-6">
            {posts.map((p) => (
              <article key={p.slug} className="p-6 bg-white rounded-2xl shadow">
                <h3 className="text-lg font-semibold">
                  <Link href={`/blog/${p.slug}`}>{p.meta.title}</Link>
                </h3>
                <div className="mt-2 text-slate-600">{p.meta.excerpt}</div>
                <div className="mt-3 text-sm text-slate-400">{p.meta.date}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
