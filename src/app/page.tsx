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
            <Link href="/chronicle">SEORCE</Link>
          </p>
          <div className="hero__cta">
            <Link href="/chronicle" className="btn btn--primary">
              See what I&apos;m building
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
              <strong>Johnpaul Nnaji is a software engineer</strong> building
              tools that help brands show up better in Google and in AI search
              (ChatGPT, Perplexity, and similar). Right now he works on{" "}
              <strong>SEORCE</strong>, a product for tracking how brands appear
              across those surfaces.
            </p>
            <p>
              He graduated with a computer science degree from Nnamdi Azikiwe
              University in 2025, then joined SEORCE. Day to day that means
              technical SEO, crawl work, and analytics around how AI systems
              pull and cite web content. The overlapping interest is SEO, AI,
              and{" "}
              <strong>generative engine optimization (GEO)</strong>: how pages
              get into AI answers in the first place.
            </p>
            <p>
              He writes while he learns. Posts are notes from building, not
              polished lectures from someone with ten years in the field.
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
                <h3>Building SEORCE</h3>
                <p>
                  SEORCE helps brands see how they show up in Google, Bing, and
                  AI search tools like ChatGPT, Perplexity, and Gemini. A big
                  part of that is{" "}
                  <strong>generative engine optimization (GEO)</strong>:
                  whether and how you get mentioned in AI answers.
                </p>
              </div>
            </li>
            <li className="now-item">
              <span className="now-item__dot" aria-hidden="true"></span>
              <div>
                <h3>Learning technical SEO</h3>
                <p>
                  Working through crawl budget, structured data, and how LLMs
                  find and cite pages. I write up what I figure out on the blog.
                </p>
              </div>
            </li>
            <li className="now-item">
              <span className="now-item__dot" aria-hidden="true"></span>
              <div>
                <h3>Writing as I go</h3>
                <p>
                  Short posts on what I&apos;m learning about SEO from a
                  software engineering background. Honest notes, not expert
                  cosplay.
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
              Latest from the blog
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
    </>
  );
}
