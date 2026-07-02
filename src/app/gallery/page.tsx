"use client";

import { useState } from "react";

interface GalleryImage {
  src: string;
  full: string;
  alt: string;
  caption: string;
  wide?: boolean;
  tall?: boolean;
}

const groups: { month: string; images: GalleryImage[] }[] = [
  {
    month: "June 2026",
    images: [
      {
        src: "https://picsum.photos/id/1015/500/500",
        full: "https://picsum.photos/id/1015/1200/900",
        alt: "Riverside, golden hour",
        caption: "Riverside, golden hour",
      },
      {
        src: "https://picsum.photos/id/1016/500/700",
        full: "https://picsum.photos/id/1016/900/1300",
        alt: "Mountain trail",
        caption: "Mountain trail",
        tall: true,
      },
      {
        src: "https://picsum.photos/id/1018/500/500",
        full: "https://picsum.photos/id/1018/1200/900",
        alt: "Open road",
        caption: "Open road",
      },
      {
        src: "https://picsum.photos/id/1019/500/500",
        full: "https://picsum.photos/id/1019/1200/900",
        alt: "Workspace, late night",
        caption: "Workspace, late night",
      },
    ],
  },
  {
    month: "May 2026",
    images: [
      {
        src: "https://picsum.photos/id/1021/700/500",
        full: "https://picsum.photos/id/1021/1400/900",
        alt: "City skyline",
        caption: "City skyline",
        wide: true,
      },
      {
        src: "https://picsum.photos/id/1024/500/500",
        full: "https://picsum.photos/id/1024/1200/900",
        alt: "Coffee and code",
        caption: "Coffee &amp; code",
      },
      {
        src: "https://picsum.photos/id/1025/500/500",
        full: "https://picsum.photos/id/1025/1200/900",
        alt: "Quiet street",
        caption: "Quiet street",
      },
    ],
  },
  {
    month: "April 2026",
    images: [
      {
        src: "https://picsum.photos/id/1035/500/500",
        full: "https://picsum.photos/id/1035/1200/900",
        alt: "Forest light",
        caption: "Forest light",
      },
      {
        src: "https://picsum.photos/id/1041/500/700",
        full: "https://picsum.photos/id/1041/900/1300",
        alt: "Old bridge",
        caption: "Old bridge",
        tall: true,
      },
      {
        src: "https://picsum.photos/id/1043/500/500",
        full: "https://picsum.photos/id/1043/1200/900",
        alt: "Desk setup",
        caption: "Desk setup",
      },
      {
        src: "https://picsum.photos/id/1050/500/500",
        full: "https://picsum.photos/id/1050/1200/900",
        alt: "Morning walk",
        caption: "Morning walk",
      },
    ],
  },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
    alt: string;
  } | null>(null);

  const close = () => setLightbox(null);

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// gallery</p>
          <h1 className="page-header__title">Captured along the way</h1>
          <p className="page-header__sub">
            A running, unfiltered timeline. Tap any photo to expand it.
          </p>
        </div>
      </section>

      <section className="timeline section__inner">
        {groups.map((group) => (
          <div className="timeline__group" key={group.month}>
            <h2 className="timeline__date mono">{group.month}</h2>
            <div className="gallery-grid">
              {group.images.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-item${img.wide ? " gallery-item--wide" : ""}${img.tall ? " gallery-item--tall" : ""}`}
                  onClick={() =>
                    setLightbox({
                      src: img.full,
                      caption: img.caption,
                      alt: img.alt,
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox */}
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
