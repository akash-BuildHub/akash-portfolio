import { CONTACT, SITE } from "@/config/site";

// Runtime SEO: keeps <head> meta tags, the canonical link and JSON-LD in sync
// with the current page (index.html ships static defaults for crawlers).

const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => meta!.setAttribute(key, value));
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

const setMetaName = (name: string, content: string) => {
  upsertMeta(`meta[name="${name}"]`, { name }, content);
};

const setMetaProperty = (property: string, content: string) => {
  upsertMeta(`meta[property="${property}"]`, { property }, content);
};

const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const setJsonLd = (id: string, payload: Record<string, unknown>) => {
  let script = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-id", id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
};

export const applyHomePageSeo = () => {
  const url = `${window.location.origin}/`;
  const image = `${window.location.origin}${SITE.image}`;

  document.title = SITE.title;
  setMetaName("description", SITE.description);
  setMetaName("author", SITE.name);
  setMetaName("keywords", SITE.keywords);
  setMetaName("twitter:card", "summary_large_image");
  setMetaName("twitter:title", SITE.title);
  setMetaName("twitter:description", SITE.description);
  setMetaName("twitter:image", image);
  setMetaProperty("og:title", SITE.title);
  setMetaProperty("og:description", SITE.description);
  setMetaProperty("og:type", "website");
  setMetaProperty("og:url", url);
  setMetaProperty("og:image", image);
  setCanonical(url);
  setMetaName("robots", "index, follow");

  setJsonLd("person", {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url,
    image,
    sameAs: [CONTACT.linkedinUrl, CONTACT.githubUrl],
    jobTitle: SITE.jobTitle,
  });
};

export const applyNotFoundSeo = (pathname: string) => {
  const title = "404 | Page Not Found";
  const description = "The page you are looking for does not exist.";

  document.title = title;
  setMetaName("description", description);
  setMetaName("twitter:title", title);
  setMetaName("twitter:description", description);
  setMetaProperty("og:title", title);
  setMetaProperty("og:description", description);
  setCanonical(`${window.location.origin}${pathname}`);
  setMetaName("robots", "noindex, nofollow");
};
