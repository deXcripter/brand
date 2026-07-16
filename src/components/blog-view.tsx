"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { resolveMediaUrl } from "@/lib/media-url";

type BlogViewProps = {
  initialPosts: BlogPost[];
};

function getFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export default function BlogView({ initialPosts }: BlogViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "search-ai" | "personal">("all");
  const [isPending, startTransition] = useTransition();

  const filteredPosts = initialPosts.filter((post) => {
    if (activeTab === "all") return true;
    return post.category === activeTab;
  });

  function handleTabChange(tab: "all" | "search-ai" | "personal") {
    startTransition(() => {
      setActiveTab(tab);
    });
  }

  return (
    <div className="section__inner blog-page-layout">
      {/* Sidebar: Categories Filter */}
      <aside className="blog-sidebar">
        <h2 className="blog-sidebar__title mono">// categories</h2>
        <nav className="blog-sidebar__nav" aria-label="Blog categories">
          <button
            type="button"
            className={`blog-sidebar__tab${activeTab === "all" ? " is-active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All posts
          </button>
          <button
            type="button"
            className={`blog-sidebar__tab${activeTab === "search-ai" ? " is-active" : ""}`}
            onClick={() => handleTabChange("search-ai")}
          >
            Search & AI
          </button>
          <button
            type="button"
            className={`blog-sidebar__tab${activeTab === "personal" ? " is-active" : ""}`}
            onClick={() => handleTabChange("personal")}
          >
            Personal
          </button>
        </nav>
      </aside>

      {/* Main Content: Cards Grid */}
      <main className="blog-main">
        {filteredPosts.length === 0 ? (
          <p className="blog-empty animate-fade-in" key={`empty-${activeTab}`}>
            No posts in this category yet. Check back soon.
          </p>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post, index) => {
              const firstImage = getFirstImage(post.content);
              return (
                <Link
                  key={`${activeTab}-${post.slug}`}
                  href={`/blog/${post.slug}`}
                  className="blog-card animate-fade-in"
                  style={{
                    animationDelay: `${index * 40}ms`,
                  }}
                >
                  {firstImage && (
                    <div className="blog-card__image-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveMediaUrl(firstImage)} alt={post.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card__content">
                    <div className="blog-card__meta">
                      <span className="blog-card__category mono">
                        {post.category === "search-ai" ? "Search & AI" : "Personal"}
                      </span>
                      <span className="blog-card__date mono">{post.date}</span>
                    </div>
                    <h2 className="blog-card__title">{post.title}</h2>
                    <p className="blog-card__subtitle">{post.subtitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
