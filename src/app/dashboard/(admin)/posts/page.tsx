"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { excerptFromHtml, getPostContent } from "@/lib/blog-content";
import { getAdminPosts, type BlogPost } from "@/lib/posts";

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminPosts()
      .then(setPosts)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load posts")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow mono">// blog</p>
          <h1 className="dashboard-header__title">Blog posts</h1>
          <p className="dashboard-muted">
            Write with a rich editor, embed images anywhere, and publish when ready.
          </p>
        </div>
        <Link href="/dashboard/posts/new" className="btn btn--primary">
          New post
        </Link>
      </header>

      {loading ? <p className="dashboard-muted">Loading posts…</p> : null}
      {error ? <p className="dashboard-form__error">{error}</p> : null}

      {!loading && posts.length === 0 ? (
        <section className="dashboard-panel post-list-empty">
          <h2 className="dashboard-panel__title">Start your first story</h2>
          <p className="dashboard-muted">
            Use headings, quotes, code blocks, and inline images, just like Medium.
          </p>
          <Link href="/dashboard/posts/new" className="btn btn--primary">
            Write a post
          </Link>
        </section>
      ) : null}

      {!loading && posts.length > 0 ? (
        <div className="post-admin-grid">
          {posts.map((post) => (
            <article className="post-admin-card" key={post.slug}>
              <div className="post-admin-card__header">
                <span
                  className={`post-admin-card__status${post.published ? " is-live" : ""}`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
                <span className="post-admin-card__date mono">{post.date}</span>
              </div>
              <h2 className="post-admin-card__title">{post.title}</h2>
              <p className="post-admin-card__subtitle">{post.subtitle}</p>
              <p className="post-admin-card__excerpt">
                {excerptFromHtml(getPostContent(post))}
              </p>
              <Link
                href={`/dashboard/posts/${post.slug}/edit`}
                className="post-admin-card__link mono"
              >
                Edit →
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
}
