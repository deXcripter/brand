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
    description: `
    <p>Before SEORCE I was mostly in crypto: smart contracts, audits, that world.</p>
<p>I took the job without being sure it was for me. The team shipped fast, and I figured I'd stay through the year then move on. Working on SEO tools changed my mind. Once I started looking at how crawlers, rankings, and AI search actually work, I got hooked.</p>
<p>I stayed. That role is where I decided to go all in on SEO and the tools around it.</p>
`,
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
      <p>My frist experience working with a team of developers, and we were all students at the time. I was responsible for the backend of the platform, and I had to learn a lot about the different technologies that will be used to build the platform.</p>`,
  },
  {
    year: "2023",
    month: "Sep",
    title: "Internship",
    at: "@ Promild Tech Limited",
    description: `<p>On paper, I was an intern at Promild Tech Limited, a 6-month program through school. In reality, I wasn't being challenged, so I left early and focused on self learning instead.</p>
      <p>During this period, I learned a lot about JavaScript, React, Node.js, MongoDB and other related web technologies. I also built a CRUD application, though I never finished it since my internship period ended before I could. Still, that project ended up being the reason I got my first shot as a developer at <strong>Bigshelf</strong>.</p>`,
  },
  {
    year: "2021",
    month: "May",
    title: "Started university",
    group: "university",
    status: "beginning",
    description:
      "<p>Always been a fan of computers, grew up playing a lot of PC games.</p><p>That got me interested, so I applied for computer science and got into the university. My story starts..</p>",
  },
];

export default function ChroniclePage() {
  const timelineByYear = buildChronicleTimeline(timelineData);

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// chronicle</p>
          <h1 className="page-header__title">Chronicle</h1>
          <p className="page-header__sub">
            School, jobs, and the work that stuck.
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
                  marginTop: gapBeforePx
                    ? `calc(${gapBeforePx}px * var(--chronicle-gap-scale, 1))`
                    : undefined,
                }}
              >
                {entries.map(({ event: entry, index: idx, marginTopPx }) => {
                  const dateRange = getHoverRange(entry, timelineData);

                  return (
                    <div
                      className="chronicle-timeline-vertical__row"
                      key={`${entry.group ?? entry.title}-${entry.year}-${entry.month}-${idx}`}
                      style={{
                        marginTop: marginTopPx ? `${marginTopPx}px` : undefined,
                      }}
                    >
                      <div className="chronicle-timeline-vertical__rail" />
                      <div className="chronicle-timeline-vertical__events">
                        <article
                          className={`chronicle-event${entry.group ? " chronicle-event--group" : ""}`}
                          data-group={entry.group}
                        >
                          <span
                            className="chronicle-event__node"
                            data-tip={dateRange}
                            tabIndex={0}
                            aria-label={dateRange}
                          />
                          <header className="chronicle-event__header">
                            <div className="chronicle-event__heading">
                              <h2 className="chronicle-event__title">
                                {entry.title}{" "}
                                {entry.at ? <span>{entry.at}</span> : null}
                              </h2>
                              <p className="chronicle-event__meta mono">
                                {dateRange}
                              </p>
                            </div>
                          </header>
                          <div
                            className="chronicle-event__description"
                            dangerouslySetInnerHTML={{
                              __html: entry.description.trim(),
                            }}
                          />
                        </article>
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
            If you&apos;re working on something in AI or search and want to talk,
            find me at <span className="mono">@dexcripter</span>.
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
