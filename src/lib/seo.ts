const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => meta!.setAttribute(key, value));
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

export const setMetaName = (name: string, content: string) => {
  upsertMeta(`meta[name="${name}"]`, { name }, content);
};

export const setMetaProperty = (property: string, content: string) => {
  upsertMeta(`meta[property="${property}"]`, { property }, content);
};

export const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export const setRobots = (content: string) => {
  setMetaName("robots", content);
};

export const setJsonLd = (id: string, payload: Record<string, unknown>) => {
  let script = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-id", id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
};
