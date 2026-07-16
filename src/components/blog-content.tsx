import { sanitizeBlogHtml } from "@/lib/blog-content";
import { addBlogImageAttributes } from "@/lib/blog-image-optimizer";

type BlogContentProps = {
  html: string;
  className?: string;
};

export default async function BlogContent({ html, className = "" }: BlogContentProps) {
  const enhancedHtml = await addBlogImageAttributes(sanitizeBlogHtml(html));

  return (
    <div
      className={`blog-content${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: enhancedHtml }}
    />
  );
}
