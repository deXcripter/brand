export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string;
  body: string[];
}

const posts: BlogPost[] = [
  {
    slug: "learning-seo",
    title: "Why I'm Learning SEO as a Software Engineer",
    subtitle:
      "Some notes on why I jumped into a discipline I knew nothing about, and what's surprised me so far.",
    date: "June 24, 2026",
    tags: "#learning-in-public &nbsp;#technical-seo &nbsp;#building",
    body: [
      "I've spent the last five years writing code — mostly backend systems, some frontend, a lot of glue between APIs. SEO never crossed my mind. It was something marketers did, not engineers.",
      "Then I started building Dexcripter, a tool that sits at the intersection of AI and search. Suddenly I couldn't ignore how content actually gets found. I had to understand crawl budgets, structured data, and why some pages rank while others vanish into the void.",
      "What surprised me most: SEO is deeply technical. It's not just keywords and backlinks — it's architecture decisions, rendering strategies, and how language models interpret your pages. As a software engineer, I actually have a head start.",
      "So here I am, learning in public. I'll get things wrong. I'll correct them. And hopefully, by the time Dexcripter ships, I'll know enough to make it genuinely useful.",
    ],
  },
  {
    slug: "ai-search",
    title: "AI Search Is Changing How Content Gets Found",
    subtitle:
      "What happens to ranking and crawlability when the reader is increasingly a language model.",
    date: "June 10, 2026",
    tags: "#ai-search &nbsp;#llm &nbsp;#future-of-seo",
    body: [
      "For the last two decades, search meant Google. You typed a query, you got ten blue links, and if your site wasn't in the top three, you might as well not exist. That model is cracking.",
      "AI-powered search — think Perplexity, Google's AI Overviews, Bing Copilot — doesn't just return links. It reads, synthesizes, and answers. The user never leaves the search page. That fundamentally changes what 'ranking' even means.",
      "If your content gets cited by an AI overview, that's arguably more valuable than ranking #1 for a keyword. But how do you optimize for that? How do you make sure an LLM understands your structured data? How do you signal authority to a model that's read a billion pages?",
      "I don't have all the answers yet, but I'm digging. This is the conversation the SEO world needs to be having right now — and as someone who builds with LLMs every day, I think I have something to contribute.",
    ],
  },
  {
    slug: "dexcripter-month-one",
    title: "Building Dexcripter: Lessons From Month One",
    subtitle:
      "What broke, what worked, and what I'd do differently starting an AI x SEO tool from scratch.",
    date: "May 28, 2026",
    tags: "#dexcripter &nbsp;#building-in-public &nbsp;#startup",
    body: [
      "Month one of building Dexcripter was humbling. I started with grand ideas — a full AI-powered SEO audit suite, automated content optimization, competitor gap analysis. By week two, I'd scaled back to one core feature: helping brands understand how search engines actually see their pages.",
      "The tech stack came together quickly: a Python backend with FastAPI, crawling with Playwright, LLM analysis via a few different models. The hard part wasn't the code — it was defining what 'helpful' actually means for someone doing SEO.",
      "Three things I learned: (1) Ship one small thing, not a suite. (2) Talk to potential users before writing a single line of code. (3) Crawlers break in ways you cannot predict. Edge cases are the whole game.",
      "I also learned that building in public is terrifying and effective. Every time I tweeted about a feature, I felt accountable to actually finish it. Month two is about getting the first beta into someone's hands.",
    ],
  },
  {
    slug: "crawl-budget",
    title: "Crawl Budget, Explained Like I'm Five",
    subtitle:
      "The technical SEO concept that finally clicked once I stopped reading definitions and just built a crawler.",
    date: "May 12, 2026",
    tags: "#technical-seo &nbsp;#crawl-budget &nbsp;#google",
    body: [
      "Imagine Google is a librarian. Every day, this librarian visits your library (your website) to check for new books (pages). But the librarian is busy — she can only visit so many libraries a day, so she allocates a 'budget' of time to each one.",
      "That's crawl budget. It's the number of pages Googlebot will crawl on your site in a given timeframe. If your library has 10,000 books but the librarian only checks 100 per day, new books might take months to be discovered.",
      "The fix isn't just 'make your site faster' — though that helps. It's about making sure Google spends its limited time on the pages that actually matter. Prune low-value URLs. Fix redirect chains. Make sure your sitemap is clean. Use <code>noindex</code> on pages you don't need in the index.",
      "Building my own crawler made this click. Watching it waste time on duplicate pages and broken links made me viscerally understand why Google cares about this stuff. It's not about being punitive — it's about efficiency at a scale most developers never think about.",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
