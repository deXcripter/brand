"use client";

import { useState } from "react";
import Link from "next/link";

interface TimelineEvent {
  year: string;
  date: string;
  title: string;
  at: string;
  description: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: "2026",
    date: "Jan — Present",
    title: "Founder",
    at: "@ dexcripter",
    description:
      "Building SEORCE, an intelligence tool to track and optimize brand visibility across search engines and AI platforms. Learning SEO in public.",
  },
  {
    year: "2025",
    date: "Jan — Dec",
    title: "Software Engineer",
    at: "@ Company",
    description:
      "Built internal tools and customer-facing features. Got curious about how search works.",
  },
  {
    year: "2024",
    date: "Jun — Dec",
    title: "Junior Engineer",
    at: "@ Startup",
    description:
      "First role out of school. Learned how to ship fast, break things, and fix them faster.",
  },
];

export default function WorkPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Group by year
  const grouped: Record<string, TimelineEvent[]> = {};
  for (const ev of timelineData) {
    if (!grouped[ev.year]) grouped[ev.year] = [];
    grouped[ev.year].push(ev);
  }
  const years = Object.keys(grouped).sort().reverse();

  let globalIdx = 0;

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// work</p>
          <h1 className="page-header__title">Work history</h1>
          <p className="page-header__sub">
            Where I&apos;ve been and what I&apos;m building now.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section__inner">
          <div
            className="work-timeline-vertical"
            id="workTimeline"
            aria-label="Work timeline"
          >
            {years.map((year) => {
              const events = grouped[year];
              return (
                <div
                  className="work-timeline-vertical__year"
                  key={year}
                  data-year={year}
                >
                  <div className="work-timeline-vertical__rail">
                    <div className="work-timeline-vertical__year-label mono">
                      {year}
                    </div>
                  </div>
                  <div className="work-timeline-vertical__events">
                    {events.map((ev) => {
                      const idx = globalIdx++;
                      const isOpen = openIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`work-event${isOpen ? " is-open" : ""}`}
                        >
                          <button
                            className="work-event__trigger"
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() =>
                              setOpenIndex(isOpen ? null : idx)
                            }
                          >
                            <span className="work-event__head">
                              <span className="work-event__date mono">
                                {ev.date}
                              </span>
                              <span className="work-event__title">
                                {ev.title} <span>{ev.at}</span>
                              </span>
                            </span>
                            <svg
                              className="work-event__chevron"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                          <div className="work-event__drop">
                            <div className="work-event__drop-inner">
                              <p>{ev.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="section__inner section__inner--center">
          <p className="eyebrow mono">// collaborate</p>
          <h2 className="section__title">Have an idea?</h2>
          <p className="connect__sub">
            I&apos;m always open to interesting projects at the intersection of AI
            and search. Reach out at{" "}
            <span className="mono">@dexcripter</span>.
          </p>
          <Link
            href="/#connect"
            className="btn btn--primary"
            style={{ marginTop: "var(--space-3)" }}
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
