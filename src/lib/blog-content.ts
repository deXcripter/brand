import DOMPurify from "isomorphic-dompurify";
import type { BlogPost } from "@/lib/types";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "h2",
  "h3",
  "hr",
  "img",
  "figure",
  "figcaption",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "class",
  "loading",
  "id",
];

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

export function getPostContent(post: BlogPost): string {
  if (post.content?.trim()) {
    return post.content;
  }

  if (post.body?.length) {
    return post.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  return "";
}

export function excerptFromHtml(html: string, maxLength = 160): string {
  const text = sanitizeBlogHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/** Inject stable ids onto h2/h3 and return the outline. */
export function annotateHeadings(html: string): {
  html: string;
  headings: BlogHeading[];
} {
  const used = new Map<string, number>();
  const headings: BlogHeading[] = [];

  const annotated = html.replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs = "", inner: string) => {
      const level = Number(tag.slice(1)) as 2 | 3;
      const text = stripTags(inner);
      if (!text) return match;

      const existingId = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
      let id =
        existingId || slugifyHeading(text) || `section-${headings.length + 1}`;

      const count = used.get(id) ?? 0;
      used.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      headings.push({ id, text, level });

      if (existingId) {
        return match.replace(/\bid=["'][^"']+["']/i, `id="${id}"`);
      }

      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    }
  );

  return { html: annotated, headings };
}

/** Convert standard img tags with captions into figure/figcaption wrappers for frontend rendering. */
export function convertImagesToFigures(html: string): string {
  return html.replace(/<img([^>]+)>/gi, (match, attrs) => {
    const srcMatch = attrs.match(/src="([^"]+)"/i);
    const altMatch = attrs.match(/alt="([^"]+)"/i);
    const titleMatch = attrs.match(/title="([^"]+)"/i);
    const classMatch = attrs.match(/class="([^"]+)"/i);

    const src = srcMatch ? srcMatch[1] : "";
    const alt = altMatch ? altMatch[1] : "";
    const title = titleMatch ? titleMatch[1] : "";
    const className = classMatch ? classMatch[1] : "";

    const caption = title || alt;

    // Only wrap in figure if there is a caption
    if (!caption || caption.trim() === "") {
      return match;
    }

    return `<figure class="blog-content__figure"><img src="${src}" alt="${alt}" class="${className}" loading="lazy" /><figcaption class="blog-content__caption">${caption}</figcaption></figure>`;
  });
}

