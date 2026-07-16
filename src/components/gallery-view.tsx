"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";
import { fetchGalleryBatch } from "@/lib/gallery";
import { formatMonthLabel } from "@/lib/gallery-date";
import { resolveMediaUrl } from "@/lib/media-url";

function groupImages(images: GalleryImage[]): Map<string, GalleryImage[]> {
  const map = new Map<string, GalleryImage[]>();
  for (const img of images) {
    const label = formatMonthLabel(new Date(img.date));
    const bucket = map.get(label) ?? [];
    bucket.push(img);
    map.set(label, bucket);
  }
  return map;
}

export default function GalleryView({
  initialImages,
  initialHasMore,
}: {
  initialImages: GalleryImage[];
  initialHasMore: boolean;
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "personal" | "random" | "events">("all");
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
    alt: string;
  } | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const isInitialMount = useRef(true);

  const close = () => setLightbox(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setImages([]);
    setHasMore(true);
    setLoading(true);
    loadingRef.current = true;

    const category = activeCategory === "all" ? undefined : activeCategory;
    fetchGalleryBatch(undefined, undefined, category)
      .then((batch) => {
        setImages(batch.images);
        setHasMore(batch.hasMore);
      })
      .catch(() => {
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [activeCategory]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const last = images[images.length - 1];
      const category = activeCategory === "all" ? undefined : activeCategory;
      const batch = await fetchGalleryBatch(last?.date, last?.id, category);
      setImages((prev) => [...prev, ...batch.images]);
      setHasMore(batch.hasMore);
    } catch {
      // silently fail — user can scroll back up and down to retry
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, images, activeCategory]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const groups = groupImages(images);

  return (
    <>
      <div className="section__inner" style={{ paddingTop: 0 }}>
        <nav className="category-tabs" aria-label="Gallery categories">
          <button
            type="button"
            className={`category-tab${activeCategory === "all" ? " is-active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`category-tab${activeCategory === "random" ? " is-active" : ""}`}
            onClick={() => setActiveCategory("random")}
          >
            Random
          </button>
          <button
            type="button"
            className={`category-tab${activeCategory === "events" ? " is-active" : ""}`}
            onClick={() => setActiveCategory("events")}
          >
            Events
          </button>
          <button
            type="button"
            className={`category-tab${activeCategory === "personal" ? " is-active" : ""}`}
            onClick={() => setActiveCategory("personal")}
          >
            Personal
          </button>
        </nav>
      </div>

      <section className="timeline section__inner">
        {Array.from(groups.entries()).map(([month, monthImages]) => (
          <div className="timeline__group" key={`${activeCategory}-${month}`}>
            <h2 className="timeline__date mono">{month}</h2>
            <div className="gallery-grid">
              {monthImages.map((img, index) => (
                <button
                  key={`${activeCategory}-${img.id}`}
                  className={`gallery-item animate-fade-in${img.wide ? " gallery-item--wide" : ""}${img.tall ? " gallery-item--tall" : ""}`}
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                  onClick={() =>
                    setLightbox({
                      src: resolveMediaUrl(img.full),
                      caption: img.caption,
                      alt: img.alt,
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveMediaUrl(img.src)} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="gallery-sentinel" />

        {loading && (
          <p className="gallery-loading mono">Loading more…</p>
        )}

        {!hasMore && images.length > 0 && (
          <p className="gallery-end mono">That&rsquo;s everything for now.</p>
        )}
      </section>

      <div
        className={`lightbox${lightbox ? " is-open" : ""}`}
        id="lightbox"
        aria-hidden={!lightbox}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button
          className="lightbox__close"
          id="lightboxClose"
          aria-label="Close"
          onClick={close}
        >
          ✕
        </button>
        <figure className="lightbox__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {lightbox && <img id="lightboxImg" src={lightbox.src} alt={lightbox.alt} />}
          <figcaption id="lightboxCaption" className="mono">
            {lightbox?.caption}
          </figcaption>
        </figure>
      </div>
    </>
  );
}
