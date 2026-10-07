import type { MetadataRoute } from "next";
import { indexable } from "@/config/seo";
import { sitemapEntries } from "@/lib/seo";

// Add new public page paths here (relative to the locale), e.g. "/about".
const pagePaths = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  return indexable ? sitemapEntries(pagePaths) : [];
}
