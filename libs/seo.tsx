import type {Metadata} from "next";
import config from "../config";

type SeoInput = {
  title?: string;
  description?: string;
  canonicalUrlRelative?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
};

const baseUrl = (() => {
  if (config.appUrl?.startsWith("http")) {
    return config.appUrl.replace(/\/$/, "");
  }
  if (config.domainName) {
    return `https://${config.domainName.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
})();

const toAbsoluteUrl = (relative?: string) => {
  if (!relative) return baseUrl;
  if (relative.startsWith("http")) return relative;
  const normalized = relative.startsWith("/") ? relative : `/${relative}`;
  return `${baseUrl}${normalized}`;
};

export function getSEOTags(input: SeoInput = {}): Metadata {
  const title = input.title ?? config.appName;
  const description = input.description ?? config.appDescription;
  const canonical = toAbsoluteUrl(input.canonicalUrlRelative);
  const ogImageUrl = input.ogImageUrl ? toAbsoluteUrl(input.ogImageUrl) : undefined;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    manifest: "/manifest.json",
    alternates: canonical ? {canonical} : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: config.appName,
      type: "website",
      images: ogImageUrl ? [{url: ogImageUrl}] : undefined
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined
    },
    icons: {
      icon: "/icons/icon.svg",
      apple: "/icons/icon.svg"
    },
    robots: input.noIndex ? {index: false, follow: false} : undefined
  };
}

export function renderSchemaTags() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.appName,
    description: config.appDescription,
    url: baseUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
    />
  );
}
