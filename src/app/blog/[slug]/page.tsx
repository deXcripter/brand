import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";
import { excerptFromHtml, getPostContent } from "@/lib/blog-content";
import BlogContent from "@/components/blog-content";

/** ISR: revalidate every 60 seconds. */
export const revalidate = 60;

/** Pre-render known slugs at build time; fall back to ISR for new posts. */
export async function generateStaticParams() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // API unreachable — will ISR on first request
  }
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found — Johnpaul Nnaji" };
  }

  const description = post.metaDescription || post.subtitle || excerptFromHtml(getPostContent(post), 160);

  return {
    title: {
      absolute: `${post.title} — Johnpaul Nnaji`,
    },
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags ? [post.tags] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="blog-post section__inner">
      {/* JSON-LD structured data for BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.metaDescription || post.subtitle,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: "Johnpaul Nnaji",
              url: "https://dexcripter.com",
            },
          }),
        }}
      />

      <Link href="/blog" className="blog-post__back mono">
        ← back to blog
      </Link>
      <p className="blog-post__date mono">{post.date}</p>
      <h1 className="blog-post__title">{post.title}</h1>
      <p className="blog-post__subtitle">{post.subtitle}</p>

      <BlogContent html={getPostContent(post)} className="blog-post__body" />

      {/* GEO: structured summary for AI extraction */}
      <aside className="blog-post__tldr" aria-label="Key takeaways">
        <h2 className="blog-post__tldr-title mono">// tldr</h2>
        <p className="blog-post__tldr-text">
          <strong>{post.title}</strong> — {post.subtitle}
        </p>
      </aside>

      {post.tags ? (
        <p
          className="blog-post__tags mono"
          dangerouslySetInnerHTML={{ __html: post.tags }}
        />
      ) : null}
    </article>
  );
}
