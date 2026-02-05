import type {MetadataRoute} from "next";
import config from "../config";

const baseUrl = config.appUrl?.replace(/\/$/, "") || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pro"],
        disallow: ["/app", "/dashboard", "/settings", "/onboarding", "/login", "/signup"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
