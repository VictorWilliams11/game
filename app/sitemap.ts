import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cbt.campusgist.com.ng"

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
  ]
}
