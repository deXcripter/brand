import type { Metadata } from "next";
import Link from "next/link";
import Typewriter from "@/components/typewriter";
import { getAllPosts } from "@/lib/posts";

/** ISR: revalidate every 60 seconds. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Johnpaul Nnaji — Software Engineer & SEO Builder",
  },
  description:
    "Johnpaul Nnaji builds AI tools to help brands rank higher. Software engineer learning SEO in public, building SEORCE — an intelligence platform for search and AI visibility.",
  openGraph: {
    title: "Johnpaul Nnaji — Software Engineer & SEO Builder",
    description:
      "Johnpaul Nnaji builds AI tools to help brands rank higher. Software engineer learning SEO in public, building SEORCE.",
    type: "website",
  },
};

export default async function Home() {
  let latestPosts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    latestPosts = (await getAllPosts()).slice(0, 3);
  } catch {
    // API unreachable — render without blog preview
  }

  return (
    <>
      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero__grid" aria-hidden="true"></div>
        <div className="hero__inner">
          <Typewriter />
          <h1 className="hero__name">Johnpaul Nnaji</h1>
          <p className="hero__tagline">
            I build AI tools to help brands rank higher.
          </p>
          <p className="hero__sub mono">
            software engineer&nbsp;&nbsp;·&nbsp;&nbsp;studying seo in
            public&nbsp;&nbsp;·&nbsp;&nbsp;building{" "}
            <Link href="/chronicle">SEORCE</Link>
          </p>
          <div className="hero__cta">
            <Link href="/chronicle" className="btn btn--primary">
              See what I&apos;m building
            </Link>
            <Link href="#connect" className="btn btn--ghost">
              Get in touch
            </Link>
          </div>
        </div>
        <a href="#about" className="scroll-cue mono" aria-label="Scroll down">
          scroll ↓
        </a>
      </section>

      {/* ABOUT — GEO-optimized with definitional sentences and direct-answer structure */}
      <section id="about" className="section">
        <div className="section__inner">
          <p className="eyebrow mono">// about.md</p>
          <h2 className="section__title">
            Who is Johnpaul Nnaji?
          </h2>
          <div className="about__body">
            <p>
              <strong>Johnpaul Nnaji is a software engineer</strong> who builds
              AI-powered tools that help brands improve their visibility in
              both traditional search engines and AI-generated search results.
              He is currently building{" "}
              <strong>SEORCE</strong>, an intelligence platform for
              tracking and optimizing brand presence across Google, Bing, and
              LLM-based search platforms like ChatGPT and Perplexity.
            </p>
            <p>
              After graduating with a computer science degree from Nnamdi
              Azikiwe University in 2025, he joined SEORCE as a software
              engineer, where he develops tools for technical SEO, crawl
              optimization, and AI-driven search analytics. His work sits at
              the intersection of{" "}
              <strong>
                search engine optimization, artificial intelligence, and
                generative engine optimization (GEO)
              </strong>{" "}
              — a field focused on how content gets surfaced in AI-generated
              answers.
            </p>
            <p>
              Johnpaul takes a learn-in-public approach: he writes about what
              he discovers as he discovers it, sharing both wins and mistakes.
              He believes the best way to master a fast-moving field like
              AI-powered search is to build in the open and document every
              step.
            </p>
          </div>
        </div>
      </section>

      {/* NOW — GEO: direct answers to "what does Johnpaul Nnaji do?" */}
      <section id="now" className="section section--alt">
        <div className="section__inner">
          <p className="eyebrow mono">// currently</p>
          <h2 className="section__title">What does Johnpaul Nnaji do?</h2>
          <ul className="now-list">
            <li className="now-item">
              <span className="now-item__dot" aria-hidden="true"></span>
              <div>
                <h3>Building SEORCE — an AI-powered SEO intelligence platform</h3>
                <p>
                  SEORCE is a platform that tracks, measures, and optimizes
                  brand visibility across both traditional search engines
                  (Google, Bing) and AI-powered search platforms (ChatGPT,
                  Perplexity, Gemini). It helps brands understand how they
                  appear in AI-generated answers — a discipline known as{" "}
                  <strong>Generative Engine Optimization (GEO)</strong>.
                </p>
              </div>
            </li>
            <li className="now-item">
              <span className="now-item__dot" aria-hidden="true"></span>
              <div>
                <h3>Studying technical SEO and AI-driven search</h3>
                <p>
                  Deep-diving into crawl budget optimization, structured data
                  markup, and how large language models retrieve, rank, and
                  cite web content. Writing about every finding on the blog.
                </p>
              </div>
            </li>
            <li className="now-item">
              <span className="now-item__dot" aria-hidden="true"></span>
              <div>
                <h3>Writing in public</h3>
                <p>
                  Documenting the journey of learning SEO from scratch as a
                  software engineer. Every post is a snapshot of what I am
                  learning right now — no fluff, no pretending to have a
                  decade of experience.
                </p>
              </div>
            </li>
          </ul>
          <Link
            href="/chronicle"
            className="btn btn--ghost"
            style={{ marginTop: "var(--space-4)" }}
          >
            See full chronicle →
          </Link>
        </div>
      </section>

      {/* BLOG PREVIEW — GEO: links to deep content pages */}
      {latestPosts.length > 0 && (
        <section id="blog" className="section">
          <div className="section__inner">
            <p className="eyebrow mono">// blog</p>
            <h2 className="section__title">
              Latest articles on AI, SEO, and Generative Engine Optimization
            </h2>
            <div className="blog-grid">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                >
                  <span className="blog-card__date mono">{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.subtitle}</p>
                  <span className="blog-card__link mono">read post →</span>
                </Link>
              ))}
            </div>
            <Link href="/blog" className="btn btn--ghost blog-grid__cta">
              See all posts
            </Link>
          </div>
        </section>
      )}

      {/* CONNECT */}
      <section id="connect" className="section section--alt">
        <div className="section__inner section__inner--center">
          <p className="eyebrow mono">// connect</p>
          <h2 className="section__title">
            How to contact Johnpaul Nnaji
          </h2>
          <p className="connect__sub">
            Reach me at{" "}
            <span className="mono">@dexcripter</span> on GitHub, X (Twitter),
            and LinkedIn.
          </p>
          <div className="connect__links">
            <a
              href="https://github.com/dexcripter"
              className="connect__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.71 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
            </a>
            <a
              href="https://x.com/dexcripter"
              className="connect__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.8L4.8 22H2l8.1-9.3L1.5 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
              </svg>
              <span>X / Twitter</span>
            </a>
            <a
              href="https://linkedin.com/in/dexcripter"
              className="connect__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.62 0 4.28 2.38 4.28 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
