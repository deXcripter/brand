import Link from "next/link";
import { getPost } from "@/lib/posts";
import { getPostContent } from "@/lib/blog-content";
import BlogContent from "@/components/blog-content";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

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

      <BlogContent html={getPostContent(post)} className="blog-post__body" />

      {post.tags ? (
        <p
          className="blog-post__tags mono"
          dangerouslySetInnerHTML={{ __html: post.tags }}
        />
      ) : null}
    </article>
  );
}
