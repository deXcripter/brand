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
];

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
