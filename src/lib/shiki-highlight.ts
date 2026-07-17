import "server-only";
import { createHighlighter, type Highlighter } from "shiki";

// Supported languages we pre-load into the shiki singleton
const LANGS = [
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "html",
  "css",
  "json",
  "bash",
  "shell",
  "python",
  "rust",
  "go",
  "sql",
  "markdown",
  "yaml",
  "toml",
  "diff",
  "plaintext",
] as const;

const THEME = "github-dark";

// Singleton – one highlighter for the whole process lifetime
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

/**
 * Walk every `<pre><code>` block in the HTML and
 * replace it with a fully wrapped, shiki-highlighted code window
 * complete with macOS traffic-light header and language badge.
 *
 * It parses the very first line of the code block for a hashtag language indicator
 * (e.g. `#typescript` or `#python`). If found, it uses that language for syntax
 * highlighting and strips that indicator line from the final displayed code.
 */
export async function highlightCodeBlocks(html: string): Promise<string> {
  // Quick bail-out when there is nothing to process
  if (!html.includes("<pre")) return html;

  const hl = await getHighlighter();

  // Regex captures: (1) class attribute from <code> if any, (2) raw code text
  const CODE_BLOCK_RE =
    /<pre[^>]*><code(?:\s+class="([^"]*)")?>([^]*?)<\/code><\/pre>/gi;

  const replacements: Array<{ original: string; replacement: string }> = [];

  let match: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((match = CODE_BLOCK_RE.exec(html)) !== null) {
    const [original, classAttr = "", encodedCode] = match;

    // Decode HTML entities
    let code = encodedCode
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Look for `#language` on the first line (allowing leading whitespace/newlines)
    let lang = classAttr.replace(/^language-/, "").trim() || "plaintext";
    
    // Parse the first line
    const lines = code.split(/\r?\n/);
    const firstLine = lines[0]?.trim() || "";

    if (firstLine.startsWith("#")) {
      const detectedLang = firstLine.slice(1).toLowerCase().trim();
      // If it's a known language, use it and remove the first line
      if ((LANGS as readonly string[]).includes(detectedLang)) {
        lang = detectedLang;
        lines.shift(); // Remove the #language line
        code = lines.join("\n");
      }
    }

    const safeLang = (LANGS as readonly string[]).includes(lang)
      ? lang
      : "plaintext";

    try {
      const shikiHtml = hl.codeToHtml(code.trim(), {
        lang: safeLang,
        theme: THEME,
      });

      const wrapped = `
<div class="shiki-window">
  <div class="shiki-window__header">
    <span class="shiki-dot shiki-dot--red"></span>
    <span class="shiki-dot shiki-dot--yellow"></span>
    <span class="shiki-dot shiki-dot--green"></span>
    <span class="shiki-window__lang">${safeLang}</span>
  </div>
  ${shikiHtml}
</div>`.trim();

      replacements.push({ original, replacement: wrapped });
    } catch {
      // Leave unprocessed if shiki errors
    }
  }

  let result = html;
  for (const { original, replacement } of replacements) {
    result = result.replace(original, replacement);
  }
  return result;
}
