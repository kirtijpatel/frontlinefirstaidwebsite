import type { MetadataRoute } from "next";

const origin = "https://uvafrontlinefirstaid.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: origin, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${origin}/gallery`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/request-training`, changeFrequency: "yearly", priority: 0.9 },
  ];
}
