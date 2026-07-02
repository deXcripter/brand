"use client";

import { useState } from "react";
import Link from "next/link";
import {
  buildChronicleTimeline,
  getHoverRange,
  type Month,
  type TimelineEvent,
} from "@/lib/chronicle-timeline";

const timelineData: TimelineEvent[] = [
  {
    year: "2025",
    month: "Jul",
    title: "Software Engineer",
    at: "@ SEORCE",
    description:
     `
     <p>Before SEORCE, I was deep into crypto. Messing with smart contracts, doing some audits, that was where my head was at.</p>
<p>When I got the offer, I wasn't excited about it. It paid the bills though, so I took it. My plan was to stay till December then leave. The team moved fast, we pushed hard almost every day, and I didn't think I'd last much longer than that.</p>
<p>Somewhere in there things shifted. Building SEO tools meant learning how a lot of stuff worked under the hood, and I actually started enjoying it. December came and went and I was still there. Turns out I wasn't in as much of a rush to leave as I thought. Still figuring myself out anyway, so why not stick around and keep learning.</p>`
  },
  {
    year: "2025",
    month: "Mar",
    title: "Graduated",
    at: "the university",
    group: "university",
    status: "end",
    description: `
      <p>Wrapped up my computer science degree at <a href="https://en.wikipedia.org/wiki/Nnamdi_Azikiwe_University" target="_blank" rel="noopener noreferrer">Nnamdi Azikiwe University</a>, Nigeria.</p>
    `,
  },
  {
    year: "2024",
    month: "Feb",
    title: "Lead Backend Engineer",
    at: "@ myBigshelf",
    description: `<p>
      <a href='https://mybigshelf.com' target='_blank' rel='noopener noreferrer'>myBigshelf</a> is a platform for book lovers to discover and share their favorite books.</p>
      <p>This was my frist experience working with a team of developers, and we were all students at the time. I was responsible for the backend of the platform, and I had to learn a lot about the different technologies that will be used to build the platform.</p>`,
  },
  {
    year: "2023",
    month: "Sep",
    title: "Internship",
    at: "@ Promild Tech Limited",
    description: `<p>On paper, I was an intern at Promild Tech Limited. This was my school's internship program supposed to last 6 months. However, i quickly realised i wasnt being challenged, so i left and focused on self learning.</p>
      <p>During this period, i learnt a lot about JavaScript, React, Node.js, MongoDB and other related web technologies. I also got to build a Todo application which i never got to complete because by the time i started working on it, my internship period was coming to an end. This project would also be the reason i got my first shot as a developer at <strong>Bigshelf</strong>.</p>`,
  },
  {
    year: "2020",
    month: "Sep",
    title: "Started university",
    group: "university",
    status: "beginning",
    description:
      "<p>Entered university, learned fundamentals, and discovered I loved building things with code.</p>",
  },
];

export default function ChroniclePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timelineByYear = buildChronicleTimeline(timelineData);

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// chronicle</p>
          <h1 className="page-header__title">Chronicle</h1>
          <p className="page-header__sub">
            Milestones, projects, and the moments that shaped my path.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section__inner">
          <div
            className="chronicle-timeline-vertical"
            id="chronicleTimeline"
            aria-label="Chronicle timeline"
          >
            {timelineByYear.map(({ year, entries, gapBeforePx }) => (
              <div
                className="chronicle-timeline-vertical__year"
                key={year}
                data-year={year}
                style={{
                  marginTop: gapBeforePx ? `${gapBeforePx}px` : undefined,
                }}
              >
                {entries.map(({ event: entry, index: idx, marginTopPx }) => {
                  const isOpen = openIndex === idx;
                  const dateRange = getHoverRange(entry, timelineData);

                  return (
                    <div
                      className="chronicle-timeline-vertical__row"
                      key={`${entry.group ?? entry.title}-${entry.year}-${entry.month}-${idx}`}
                      style={{ marginTop: marginTopPx ? `${marginTopPx}px` : undefined }}
                    >
                      <div className="chronicle-timeline-vertical__rail" />
                      <div className="chronicle-timeline-vertical__events">
                        <div
                          className={`chronicle-event${isOpen ? " is-open" : ""}${entry.group ? " chronicle-event--group" : ""}`}
                          data-group={entry.group}
                        >
                          <span
                            className="chronicle-event__node"
                            data-tip={dateRange}
                            tabIndex={0}
                            aria-label={dateRange}
                          />
                          <button
                            className="chronicle-event__trigger"
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                          >
                            <span className="chronicle-event__title">
                              {entry.title}{" "}
                              {entry.at ? <span>{entry.at}</span> : null}
                            </span>
                            <svg
                              className="chronicle-event__chevron"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                          <div className="chronicle-event__drop">
                            <div className="chronicle-event__drop-inner">
                              <div
                                className="chronicle-event__description"
                                dangerouslySetInnerHTML={{
                                  __html: entry.description.trim(),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="chronicle-timeline-vertical__row chronicle-timeline-vertical__row--marker">
                  <div className="chronicle-timeline-vertical__rail">
                    <div className="chronicle-timeline-vertical__year-label mono">
                      {year}
                    </div>
                  </div>
                  <div className="chronicle-timeline-vertical__events" />
                </div>
              </div>
            ))}
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

export type { Month, TimelineEvent };
