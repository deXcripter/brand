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

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogView({ initialPosts }: BlogViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "search-ai" | "personal">(
    "all"
  );
  const [, startTransition] = useTransition();

  const filteredPosts =
    activeTab === "all"
      ? initialPosts
      : initialPosts.filter((post) => post.category === activeTab);

  function handleTabChange(tab: "all" | "search-ai" | "personal") {
    startTransition(() => {
      setActiveTab(tab);
    });
  }

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <section className="blog-dashboard">
      <div className="blog-dashboard__inner">
        {/* Category filter tabs */}
        <nav className="blog-tabs" aria-label="Blog categories">
          <button
            type="button"
            className={`blog-tabs__btn${activeTab === "all" ? " is-active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All Posts
          </button>
          <button
            type="button"
            className={`blog-tabs__btn${activeTab === "search-ai" ? " is-active" : ""}`}
            onClick={() => handleTabChange("search-ai")}
          >
            Search &amp; AI
          </button>
          <button
            type="button"
            className={`blog-tabs__btn${activeTab === "personal" ? " is-active" : ""}`}
            onClick={() => handleTabChange("personal")}
          >
            Personal
          </button>
        </nav>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <p className="blog-empty animate-fade-in" key={`empty-${activeTab}`}>
            No posts in this category yet. Check back soon.
          </p>
        )}

        {/* Dashboard grid */}
        {filteredPosts.length > 0 && (
          <div
            className={`blog-mosaic${restPosts.length === 0 ? " blog-mosaic--single" : ""}`}
            key={`grid-${activeTab}`}
          >
            {/* Featured / hero card */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="blog-tile blog-tile--hero animate-fade-in"
              >
                <div className="blog-tile__media">
                  {getFirstImage(featuredPost.content) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(
                        getFirstImage(featuredPost.content)!
                      )}
                      alt={featuredPost.title}
                      loading="eager"
                    />
                  ) : (
                    <div className="blog-tile__placeholder" />
                  )}
                  <div className="blog-tile__gradient" />
                </div>
                <div className="blog-tile__overlay">
                  <h2 className="blog-tile__title">{featuredPost.title}</h2>
                  <p className="blog-tile__subtitle">
                    {featuredPost.subtitle}
                  </p>
                  <div className="blog-tile__meta">
                    <span className="blog-tile__category">
                      {featuredPost.category === "search-ai"
                        ? "#SEARCH & AI"
                        : "#PERSONAL"}
                    </span>
                    <span className="blog-tile__date">
                      {formatDate(featuredPost.date)}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of the cards */}
            {restPosts.map((post, index) => {
              const firstImage = getFirstImage(post.content);
              return (
                <Link
                  key={`${activeTab}-${post.slug}`}
                  href={`/blog/${post.slug}`}
                  className="blog-tile animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 60}ms` }}
                >
                  <div className="blog-tile__media">
                    {firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(firstImage)}
                        alt={post.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="blog-tile__placeholder" />
                    )}
                    <div className="blog-tile__gradient" />
                  </div>
                  <div className="blog-tile__overlay">
                    <h2 className="blog-tile__title">{post.title}</h2>
                    <div className="blog-tile__meta">
                      <span className="blog-tile__category">
                        {post.category === "search-ai"
                          ? "#SEARCH & AI"
                          : "#PERSONAL"}
                      </span>
                      <span className="blog-tile__date">
                        {formatDate(post.date)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
