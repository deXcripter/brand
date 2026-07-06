import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // API unreachable — render empty list
  }

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// blog</p>
          <h1 className="page-header__title">Writing as I learn</h1>
          <p className="page-header__sub">
            Notes on AI, SEO, and whatever Dexcripter teaches me this week.
          </p>
        </div>
      </section>

      <section className="post-list section__inner">
        {posts.map((post) => (
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
        ))}
      </section>
    </>
  );
}
