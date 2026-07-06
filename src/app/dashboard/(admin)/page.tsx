"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminGalleryImages } from "@/lib/gallery";
import { getAdminPosts } from "@/lib/posts";

export default function DashboardPage() {
  const [published, setPublished] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [images, setImages] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAdminPosts(), getAdminGalleryImages()])
      .then(([posts, galleryImages]) => {
        setPublished(posts.filter((post) => post.published).length);
        setDrafts(posts.filter((post) => !post.published).length);
        setImages(galleryImages.length);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      );
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow mono">// overview</p>
          <h1 className="dashboard-header__title">Dashboard</h1>
        </div>
      </header>

      {error ? <p className="dashboard-form__error">{error}</p> : null}

      <div className="dashboard-stats">
        <article className="dashboard-stat">
          <p className="dashboard-stat__label mono">Published posts</p>
          <p className="dashboard-stat__value">{published}</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat__label mono">Drafts</p>
          <p className="dashboard-stat__value">{drafts}</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat__label mono">Gallery images</p>
          <p className="dashboard-stat__value">{images}</p>
        </article>
      </div>

      <section className="dashboard-panel">
        <h2 className="dashboard-panel__title">Quick actions</h2>
        <div className="dashboard-actions">
          <Link href="/dashboard/posts/new" className="btn btn--primary">
            New blog post
          </Link>
          <Link href="/dashboard/gallery" className="btn btn--ghost">
            Upload images
          </Link>
        </div>
      </section>
    </>
  );
}
