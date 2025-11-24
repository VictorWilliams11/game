import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin-secure-portal/", "/student/", "/auth/"],
    },
    sitemap: "https://cbt-campusgist.com.ng/sitemap.xml",
  }
}
