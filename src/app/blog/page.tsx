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
    "Essays and notes on building, search, and the rest of life.",
  openGraph: {
    title: "Blog | Johnpaul Nnaji",
    description:
      "Essays and notes on building, search, and the rest of life.",
    type: "website",
  },
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // API unreachable — render empty state so the page doesn't crash
  }

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// blog</p>
          <h1 className="page-header__title">Journal</h1>
          <p className="page-header__sub">
            Essays and notes - some about building, some about being human.
            Written when something needs saying.
          </p>
          {posts.length > 0 ? (
            <p className="page-header__meta mono">
              {posts.length} {posts.length === 1 ? "entry" : "entries"}
            </p>
          ) : null}
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
              <span className="post-row__arrow mono" aria-hidden="true">
                →
              </span>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
