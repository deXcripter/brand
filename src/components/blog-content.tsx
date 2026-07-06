import { resolveMediaInHtml } from "@/lib/media-url";
import { sanitizeBlogHtml } from "@/lib/blog-content";

type BlogContentProps = {
  html: string;
  className?: string;
};

export default function BlogContent({ html, className = "" }: BlogContentProps) {
  const safeHtml = sanitizeBlogHtml(resolveMediaInHtml(html));

  return (
    <div
      className={`blog-content${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
