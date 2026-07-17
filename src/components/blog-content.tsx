import { sanitizeBlogHtml } from "@/lib/blog-content";
import { addBlogImageAttributes } from "@/lib/blog-image-optimizer";
import { highlightCodeBlocks } from "@/lib/shiki-highlight";

type BlogContentProps = {
  html: string;
  className?: string;
};

export default async function BlogContent({ html, className = "" }: BlogContentProps) {
  const sanitized = sanitizeBlogHtml(html);
  const withImages = await addBlogImageAttributes(sanitized);
  const withCode = await highlightCodeBlocks(withImages);

  return (
    <div
      className={`blog-content${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: withCode }}
    />
  );
}
