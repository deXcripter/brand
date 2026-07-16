import "server-only";

import sharp from "sharp";
import { getApiUrl } from "@/lib/api-client";

type ImageMeta = {
  width?: number;
  height?: number;
};

function extractImageSources(html: string): string[] {
  const sources = new Set<string>();
  const regex = /<img\b[^>]*\bsrc="([^"]+)"/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    sources.add(match[1]);
  }

  return Array.from(sources);
}

async function getImageMeta(src: string): Promise<ImageMeta> {
  try {
    const imageUrl = new URL(src, getApiUrl());
    const response = await fetch(imageUrl, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) return {};

    const buffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch {
    return {};
  }
}

export async function addBlogImageAttributes(html: string): Promise<string> {
  const sources = extractImageSources(html);
  const entries = await Promise.all(
    sources.map(async (src) => [src, await getImageMeta(src)] as const)
  );
  const metaMap = new Map(entries);
  let imageIndex = 0;
  let figureDepth = 0;

  return html.replace(/<\/?(?:figure|img)([^>]*)>/gi, (match) => {
    if (/^<figure\b/i.test(match)) {
      figureDepth += 1;
      return match;
    }

    if (/^<\/figure\b/i.test(match)) {
      figureDepth = Math.max(0, figureDepth - 1);
      return match;
    }

    const attrs = match.slice(4, -1);
    const srcMatch = attrs.match(/src="([^"]+)"/i);
    const altMatch = attrs.match(/alt="([^"]*)"/i);
    const titleMatch = attrs.match(/title="([^"]*)"/i);
    const classMatch = attrs.match(/class="([^"]*)"/i);
    const widthMatch = attrs.match(/width="([^"]+)"/i);
    const heightMatch = attrs.match(/height="([^"]+)"/i);
    const loadingMatch = attrs.match(/loading="([^"]+)"/i);
    const fetchPriorityMatch = attrs.match(/fetchpriority="([^"]+)"/i);

    const src = srcMatch ? srcMatch[1] : "";
    const alt = altMatch ? altMatch[1] : "";
    const title = titleMatch ? titleMatch[1] : "";
    const className = classMatch ? classMatch[1] : "";
    const meta = metaMap.get(src);
    const isFirstImage = imageIndex === 0;
    imageIndex += 1;

    const width = widthMatch ? widthMatch[1] : meta?.width ? String(meta.width) : "";
    const height = heightMatch ? heightMatch[1] : meta?.height ? String(meta.height) : "";
    const loading = loadingMatch?.[1] || (isFirstImage ? "eager" : "lazy");
    const fetchPriority = fetchPriorityMatch?.[1] || (isFirstImage ? "high" : "auto");

    const imageAttrs = [
      `src="${src}"`,
      `alt="${alt}"`,
      className ? `class="${className}"` : null,
      width ? `width="${width}"` : null,
      height ? `height="${height}"` : null,
      `loading="${loading}"`,
      `fetchpriority="${fetchPriority}"`,
      `decoding="async"`,
    ]
      .filter(Boolean)
      .join(" ");

    const caption = title || alt;

    if (figureDepth > 0 || !caption || caption.trim() === "") {
      return `<img ${imageAttrs}>`;
    }

    return `<figure class="blog-content__figure"><img ${imageAttrs} /><figcaption class="blog-content__caption">${caption}</figcaption></figure>`;
  });
}