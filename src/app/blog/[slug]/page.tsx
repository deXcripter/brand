import Link from "next/link";
import { getPost } from "@/lib/posts";

export function generateStaticParams() {
  return [
    { slug: "learning-seo" },
    { slug: "ai-search" },
    { slug: "dexcripter-month-one" },
    { slug: "crawl-budget" },
  ];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <section className="page-header">
        <div className="section__inner">
          <h1 className="page-header__title">Post not found</h1>
          <Link href="/blog" className="btn btn--ghost">
            ← back to blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="blog-post section__inner">
      <Link href="/blog" className="blog-post__back mono">
        ← back to blog
      </Link>
      <p className="blog-post__date mono">{post.date}</p>
      <h1 className="blog-post__title">{post.title}</h1>
      <p className="blog-post__subtitle">{post.subtitle}</p>

      <div className="blog-post__body">
        {post.body.map((paragraph, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>

      <p
        className="blog-post__tags mono"
        dangerouslySetInnerHTML={{ __html: post.tags }}
      />
    </article>
  );
}
