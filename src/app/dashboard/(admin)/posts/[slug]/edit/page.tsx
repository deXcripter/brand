"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostEditor from "@/components/dashboard/post-editor";
import { getAdminPost, type BlogPost } from "@/lib/posts";

export default function EditPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.slug) return;
    getAdminPost(params.slug)
      .then(setPost)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load post")
      );
  }, [params.slug]);

  if (error) {
    return <p className="dashboard-form__error">{error}</p>;
  }

  if (!post) {
    return <p className="dashboard-muted">Loading post…</p>;
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow mono">// blog</p>
          <h1 className="dashboard-header__title">Edit post</h1>
        </div>
      </header>
      <PostEditor mode="edit" initial={post} />
    </>
  );
}
