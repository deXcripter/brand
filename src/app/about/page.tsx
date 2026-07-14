import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who is Johnpaul Nnaji and what is he currently building? Learn about his background, interests in technical SEO, and generative engine optimization (GEO).",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// about.md</p>
          <h1 className="page-header__title">About Me</h1>
          <p className="page-header__sub">
            Software engineer, learning SEO, building SEORCE.
          </p>
        </div>
      </section>

      {/* ABOUT BODY */}
      <section className="section">
        <div className="section__inner">
          <div className="about__body" style={{ maxWidth: "720px", fontSize: "var(--fs-lg)" }}>
            <p style={{ marginBottom: "var(--space-3)" }}>
              <strong>Johnpaul Nnaji is a software engineer</strong> building
              tools that help brands show up better in Google and in AI search
              (ChatGPT, Perplexity, and similar). Right now he works on{" "}
              <Link href="/chronicle" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                <strong>SEORCE</strong>
              </Link>
              , a product for tracking how brands appear across those surfaces.
            </p>
            <p style={{ marginBottom: "var(--space-3)" }}>
              He graduated with a computer science degree from Nnamdi Azikiwe
              University in 2025, then joined SEORCE. Day to day that means
              technical SEO, crawl work, and analytics around how AI systems
              pull and cite web content. The overlapping interest is SEO, AI,
              and{" "}
              <strong>generative engine optimization (GEO)</strong>: how pages
              get into AI answers in the first place.
            </p>
            <p style={{ marginBottom: "var(--space-3)" }}>
              He writes while he learns. Posts are notes from building, not
              polished lectures from someone with ten years in the field.
            </p>
          </div>
        </div>
      </section>

      {/* CURRENTLY SECTION */}
      <section className="section section--alt">
        <div className="section__inner">
          <p className="eyebrow mono">// currently</p>
          <h2 className="section__title">What does Johnpaul Nnaji do?</h2>
          <ul className="now-list" style={{ marginTop: "var(--space-4)" }}>
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
        </div>
      </section>
    </>
  );
}
