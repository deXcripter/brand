"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/dashboard/blog-editor";
import { getPostContent } from "@/lib/blog-content";
import { normalizeMediaInHtml } from "@/lib/media-url";
import {
  createPost,
  deletePost,
  updatePost,
  type BlogPost,
} from "@/lib/posts";

type PostEditorProps = {
  mode: "create" | "edit";
  initial?: BlogPost;
};

function defaultDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostEditor({ mode, initial }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [date, setDate] = useState(initial?.date ?? defaultDate());
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [content, setContent] = useState(() =>
    initial ? getPostContent(initial) : "<p></p>"
  );
  const [published, setPublished] = useState(initial?.published ?? false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return 0;
    return text.split(" ").length;
  }, [content]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const plainContent = content.replace(/<[^>]+>/g, "").trim();
    if (!plainContent) {
      setError("Write something before saving.");
      setLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      subtitle: subtitle.trim(),
      date,
      tags,
      content: normalizeMediaInHtml(content),
      published,
    };

    try {
      if (mode === "create") {
        await createPost(payload);
      } else if (initial) {
        await updatePost(initial.slug, {
          ...payload,
          newSlug: slug.trim() || initial.slug,
        });
      }
      router.push("/dashboard/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!initial || !confirm("Delete this post?")) return;

    setLoading(true);
    try {
      await deletePost(initial.slug);
      router.push("/dashboard/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
      setLoading(false);
    }
  }

  return (
    <form className="post-editor" onSubmit={onSubmit}>
      <div className="post-editor__hero">
        <input
          className="post-editor__title"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Title"
          required
        />
        <input
          className="post-editor__subtitle"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          placeholder="Subtitle — a short hook for readers"
          required
        />
      </div>

      <BlogEditor content={content} onChange={setContent} disabled={loading} />

      <div className="post-editor__meta">
        <button
          type="button"
          className="post-editor__settings-toggle mono"
          onClick={() => setShowSettings((open) => !open)}
        >
          {showSettings ? "Hide settings" : "Post settings"}
        </button>
        <span className="post-editor__count mono">{wordCount} words</span>
      </div>

      {showSettings ? (
        <section className="post-editor__settings dashboard-panel">
          <div className="dashboard-form__grid">
            <label className="dashboard-field">
              <span className="dashboard-field__label mono">Slug</span>
              <input
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                placeholder="auto-generated from title"
              />
            </label>
            <label className="dashboard-field">
              <span className="dashboard-field__label mono">Date</span>
              <input
                type="date"
                value={toInputDate(date)}
                onChange={(event) =>
                  setDate(fromInputDate(event.target.value))
                }
              />
            </label>
            <label className="dashboard-field dashboard-field--full">
              <span className="dashboard-field__label mono">Tags</span>
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="ai, seo, engineering"
              />
            </label>
            <label className="dashboard-field dashboard-field--checkbox">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
              />
              <span>Published</span>
            </label>
          </div>
        </section>
      ) : null}

      {error ? <p className="dashboard-form__error">{error}</p> : null}

      <div className="post-editor__actions">
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading
            ? "Saving…"
            : mode === "create"
              ? published
                ? "Publish"
                : "Save draft"
              : "Save changes"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function toInputDate(displayDate: string): string {
  const parsed = new Date(displayDate);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function fromInputDate(value: string): string {
  const parsed = new Date(`${value}T12:00:00`);
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
