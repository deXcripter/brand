import type { Metadata } from "next";
import Link from "next/link";
import Typewriter from "@/components/typewriter";
import { getAllPosts } from "@/lib/posts";

/** ISR: revalidate every 60 seconds. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Johnpaul Nnaji | Software Engineer & SEO Builder",
  },
  description:
    "Johnpaul Nnaji is a software engineer building AI tools for search visibility. Currently working on SEORCE.",
  openGraph: {
    title: "Johnpaul Nnaji | Software Engineer & SEO Builder",
    description:
      "Software engineer building AI tools for search. Currently working on SEORCE.",
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
            software engineer&nbsp;&nbsp;·&nbsp;&nbsp;learning seo&nbsp;&nbsp;·&nbsp;&nbsp;building{" "}
            <Link href="/about">SEORCE</Link>
          </p>
          <div className="hero__cta">
            <Link href="/about" className="btn btn--primary">
              Learn more about me
            </Link>
          </div>
        </div>
        <a href="#explore" className="scroll-cue mono" aria-label="Scroll down">
          explore ↓
        </a>
      </section>

      {/* EXPLORE HUB */}
      <section id="explore" className="section">
        <div className="section__inner">
          <p className="eyebrow mono">// index.md</p>
          <h2 className="section__title">Explore</h2>

          <div className="blog-grid" style={{ marginTop: "var(--space-4)" }}>
            <Link href="/about" className="explore-card">
              <div className="explore-card__bg" style={{ backgroundImage: "url('/about_bg.png')" }} />
              <div className="explore-card__content">
                {/* <span className="blog-card__date mono">// about</span> */}
                <h3>About Me</h3>
                <div>
                  -----
                </div>
                <p>
                  Software engineer building SEORCE.
                </p>
                <span className="blog-card__link mono" style={{ marginTop: "auto" }}>go to about →</span>
              </div>
            </Link>

            <Link href="/chronicle" className="explore-card">
              <div className="explore-card__bg" style={{ backgroundImage: "url('/journey_bg.png')" }} />
              <div className="explore-card__content">
                {/* <span className="blog-card__date mono">// chronicle</span> */}
                <h3>My Journey</h3>
                <div>
                  -----
                </div>
                <p>
                  Interactive timeline of milestones, projects, and roles.
                </p>
                <span className="blog-card__link mono" style={{ marginTop: "auto" }}>view timeline →</span>
              </div>
            </Link>

            <Link href="/gallery" className="explore-card">
              <div className="explore-card__bg" style={{ backgroundImage: "url('/gallery_bg.png')" }} />
              <div className="explore-card__content">
                {/* <span className="blog-card__date mono">// gallery</span> */}
                <h3>Gallery</h3>
                <div>
                  -----
                </div>
                <p>
                  Visual snapshots, personal experiments, and highlights.
                </p>
                <span className="blog-card__link mono" style={{ marginTop: "auto" }}>open gallery →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      {latestPosts.length > 0 && (
        <section id="blog" className="section section--alt">
          <div className="section__inner">
            <p className="eyebrow mono">// blog</p>
            <h2 className="section__title">
              Latest from the blog
            </h2>
            <div className="blog-grid" style={{ marginTop: "var(--space-4)" }}>
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
    </>
  );
}
