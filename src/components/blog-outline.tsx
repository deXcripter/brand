"use client";

import { useEffect, useState } from "react";
import type { BlogHeading } from "@/lib/blog-content";

type BlogOutlineProps = {
  headings: BlogHeading[];
};

export default function BlogOutline({ headings }: BlogOutlineProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="blog-outline" aria-label="On this page">
      <p className="blog-outline__label mono">// on this page</p>
      <ol className="blog-outline__list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`blog-outline__item blog-outline__item--h${heading.level}${
              activeId === heading.id ? " is-active" : ""
            }`}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
