// src/lib/seo.tsx
import React from "react";

export default function SEO({ title, desc, image, children }: { title?: string; desc?: string; image?: string; children?: any }) {
  const site = "Aqua Minder";
  const pageTitle = title ? `${title} — ${site}` : site;
  const descText = desc || "Smart water monitoring for homes and small businesses.";
  const img = image || "/images/og-default.png";

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={descText} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={descText} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      {children}
    </>
  );
}
