import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

/** ISR: revalidate every 60 seconds so new posts appear without a full redeploy. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Blog — AI, SEO & GEO by Johnpaul Nnaji",
  },
  description:
    "Writing about AI, SEO, and building SEORCE in public. Technical deep-dives on crawl optimization, AI-powered search, and generative engine visibility.",
  openGraph: {
    title: "Blog — AI, SEO & GEO by Johnpaul Nnaji",
    description:
      "Writing about AI, SEO, and building SEORCE in public. Technical deep-dives on crawl optimization, AI-powered search, and generative engine visibility.",
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
            <strong>
              A learn-in-public journal on AI-powered search, technical SEO,
              and Generative Engine Optimization (GEO).
            </strong>{" "}
            Every article is written by Johnpaul Nnaji as he builds SEORCE
            — an intelligence platform that tracks brand visibility across
            search engines and AI platforms. No decade of experience, just
            building in the open and getting less wrong every week.
          </p>
        </div>
      </section>

      <section className="post-list section__inner">
        {posts.length === 0 ? (
          <p className="post-list__empty">No posts yet — check back soon.</p>
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
