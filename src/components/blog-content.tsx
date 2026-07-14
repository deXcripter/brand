import { sanitizeBlogHtml, convertImagesToFigures } from "@/lib/blog-content";

type BlogContentProps = {
  html: string;
  className?: string;
};

export default function BlogContent({ html, className = "" }: BlogContentProps) {
  const safeHtml = convertImagesToFigures(sanitizeBlogHtml(html));

  return (
    <div
      className={`blog-content${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
