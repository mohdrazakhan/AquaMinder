import { NextResponse } from "next/server";

// IMPORTANT: update this before deployment
const BASE_URL = "https://your-domain.com";

export async function GET() {
  const pages = [
    "",
    "/features",
    "/product",
    "/pricing",
    "/about",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
    "/refund",
    "/support",
    "/faq",
    "/careers",
  ];

  const urls = pages
    .map((page) => {
      return `
        <url>
          <loc>${BASE_URL}${page}</loc>
          <changefreq>weekly</changefreq>
          <priority>${page === "" ? "1.0" : "0.7"}</priority>
        </url>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>
  `;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
