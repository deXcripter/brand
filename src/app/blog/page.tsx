import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

/** ISR: revalidate every 60 seconds so new posts appear without a full redeploy. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Blog | Johnpaul Nnaji",
  },
  description:
    "Notes on SEO, AI search, and building SEORCE. Written while learning, not after the fact.",
  openGraph: {
    title: "Blog | Johnpaul Nnaji",
    description:
      "Notes on SEO, AI search, and building SEORCE. Written while learning, not after the fact.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// blog</p>
          <h1 className="page-header__title">Writing as I learn</h1>
          <p className="page-header__sub">
            Notes on SEO, AI search, and whatever I run into while building
            SEORCE. I&apos;m learning this in public, so expect rough edges.
          </p>
        </div>
      </section>

      <section className="post-list section__inner">
        {posts.length === 0 ? (
          <p className="post-list__empty">No posts yet. Check back soon.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="post-row"
            >
              <span className="post-row__date mono">{post.date}</span>
              <div className="post-row__body">
                <h2>{post.title}</h2>
                <p>{post.subtitle}</p>
              </div>
              <span className="post-row__arrow mono">→</span>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
