// src/app/product/[model]/page.tsx
import React from "react";
import SEO from "@/lib/seo";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export const dynamic = "force-static"; // optional, but prevents unexpected caching in some setups

export default function ProductModelPage() {
  return (
    <>
      <SEO title="Product — Aqua Minder" />
      <main className="py-12">
        <div className="container mx-auto px-6">
          {/* ProductDetailClient will read the route param using useParams() */}
          <ProductDetailClient />
        </div>
      </main>
    </>
  );
}
