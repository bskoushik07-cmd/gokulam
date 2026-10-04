import type { MetadataRoute } from "next";
import { outlets } from "@/content";

/** SEO sitemap — static routes + outlet detail pages + menu pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gokulam.in";
  const staticRoutes = [
    "",
    "/our-story",
    "/menu",
    "/menu/janpath",
    "/menu/sector-62",
    "/experiences",
    "/outlets",
    "/contact",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...outlets.map((o) => ({
      url: `${base}/outlets/${o.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
