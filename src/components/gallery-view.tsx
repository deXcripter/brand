"use client";

import { useState } from "react";
import type { GalleryGroup } from "@/lib/gallery";
import { resolveMediaUrl } from "@/lib/media-url";

export default function GalleryView({ groups }: { groups: GalleryGroup[] }) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
    alt: string;
  } | null>(null);

  const close = () => setLightbox(null);

  return (
    <>
      <section className="timeline section__inner">
        {groups.map((group) => (
          <div className="timeline__group" key={group.month}>
            <h2 className="timeline__date mono">{group.month}</h2>
            <div className="gallery-grid">
              {group.images.map((img) => (
                <button
                  key={img.id}
                  className={`gallery-item${img.wide ? " gallery-item--wide" : ""}${img.tall ? " gallery-item--tall" : ""}`}
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
