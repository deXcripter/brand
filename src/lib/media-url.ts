/** Normalize any stored media reference to a same-origin `/api/media/...` path. */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;

  if (url.startsWith("/api/media/")) {
    return url;
  }

  if (url.startsWith("uploads/")) {
    return `/api/media/${url}`;
  }

  const mediaMatch = url.match(/\/api\/media\/(.+)$/);
  if (mediaMatch) {
    return `/api/media/${mediaMatch[1]}`;
  }

  return url;
}

/** Strip host so only `/api/media/...` paths are stored. */
export function toStoredMediaUrl(url: string): string {
  const mediaMatch = url.match(/\/api\/media\/(.+)$/);
  if (mediaMatch) {
    return `/api/media/${mediaMatch[1]}`;
  }

  if (url.startsWith("uploads/")) {
    return `/api/media/${url}`;
  }

  return url;
}

export function normalizeMediaInHtml(html: string): string {
  return html.replace(
    /(<img\b[^>]*\bsrc=")([^"]+)(")/gi,
    (_match, prefix, src, suffix) => `${prefix}${toStoredMediaUrl(src)}${suffix}`
  );
}

export function resolveMediaInHtml(html: string): string {
  return html.replace(
    /(<img\b[^>]*\bsrc=")([^"]+)(")/gi,
    (_match, prefix, src, suffix) => `${prefix}${resolveMediaUrl(src)}${suffix}`
  );
}
