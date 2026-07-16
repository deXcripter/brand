# Blog Post Performance Notes
Date: 2026-07-16
Scope: individual blog post pages (`/blog/[slug]`)

## 1) Large inline blog image is the main LCP problem
Observed:
- The LCP element is an image served from `/api/media/uploads/...png`.
- It is ~520 KiB in its current form.
- Lighthouse says the image is larger than its displayed size and is being lazy-loaded.

Why it matters:
- The page cannot finish its visual load until this image arrives.
- Lazy-loading the LCP image makes the browser wait longer than necessary.

How to fix:
- Do not lazy-load the first visible blog image if it is the LCP image.
- Add explicit width and height to the rendered image.
- Prefer a responsive image pipeline with AVIF/WebP and multiple sizes.
- If the image comes from stored HTML, rewrite it to a real responsive image component or add metadata so the renderer can output width/height and `fetchpriority="high"` for the first image.

Where to look:
- [frontend/src/components/blog-content.tsx](frontend/src/components/blog-content.tsx)
- [frontend/src/lib/blog-content.ts](frontend/src/lib/blog-content.ts)
- [frontend/src/app/globals.css](frontend/src/app/globals.css#L1467)
- [frontend/src/lib/media-url.ts](frontend/src/lib/media-url.ts)

## 2) The same image is causing CLS because it has no explicit size
Observed:
- Lighthouse flags the blog image as an unsized image element.
- CLS contribution is about 0.1.

Why it matters:
- The page shifts after the image loads because layout space is not reserved.

How to fix:
- Preserve the intrinsic width and height on the image.
- Render a wrapper with the correct aspect ratio before the image loads.
- If the CMS/editor does not store dimensions, extract and persist them when the image is uploaded.

Best implementation options:
- Add width/height attributes into the stored HTML.
- Or replace HTML `<img>` with Next.js `Image` for post content where practical.

## 3) Render-blocking CSS is real, but lower priority than the image
Observed:
- The generated CSS chunk (`/_next/static/chunks/1o6hhm3108v9s.css`) is blocking initial render.
- It is about 10 KiB.

Why it matters:
- CSS is render-blocking by design, so it sits on the critical path.
- This is not huge, but it still delays paint a bit.

How to fix:
- Reduce unused global CSS in [frontend/src/app/globals.css](frontend/src/app/globals.css).
- Move blog-only styling into route/component-scoped styles where possible.
- Avoid large global rules that are only used by one page.

Reality check:
- This is a valid optimization, but it will not beat fixing the blog image first.

## 4) The blog image is lazy-loaded, which hurts LCP for above-the-fold content
Observed:
- Lighthouse explicitly says LCP resources should not use `loading="lazy"`.

Why it matters:
- The browser delays the request for the most important visible image.

How to fix:
- Make the first content image eager or high priority.
- Only lazy-load images that are clearly below the fold.
- If multiple images exist, treat the first above-the-fold one differently from the rest.

## 5) Legacy JavaScript bytes can likely be reduced, but this is secondary
Observed:
- Lighthouse reports wasted bytes from baseline features like `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `trimStart`, `trimEnd`.
- The app bundle is still fairly small, but there is some avoidable legacy/transpile overhead.

Why it matters:
- Extra transforms and polyfills increase parse/compile work.
- This matters more on mobile devices and slower CPUs.

How to fix:
- Check whether your browser support target is broader than needed.
- Tighten the browserslist/Next build target only if you are comfortable dropping older browsers.
- Remove any direct polyfill imports if present.
- Re-test after the image fix so you can see whether this is still worth pursuing.

## 6) Third-party scripts are small, but they still sit on the critical path
Observed:
- `cdn.exeolabs.xyz/script.js` and Plausible are both present.
- Lighthouse flags them as third-party code and mentions preconnect candidates.

Why it matters:
- Even small scripts can compete with the page's early network work.

How to fix:
- Keep them deferred or `lazyOnload` if you want them to stay.
- Add preconnect only if the analytics request is still considered important for your page.
- If you want absolute minimum LCP impact for testing, temporarily disable one or both scripts and compare results.

## 7) Unused or delayed image formats are the biggest win opportunity
Observed:
- The current blog image is a PNG served through the media API.

How to fix:
- Generate a WebP or AVIF variant at upload time.
- Serve responsive widths, not a single 1920px file for a 637px display area.
- If you keep the media API, add resizing and format negotiation before the browser gets the file.

## Recommended order
1. Fix the LCP image: responsive size, explicit width/height, and no lazy-load.
2. Convert the uploaded media pipeline to WebP/AVIF with responsive sizes.
3. Trim the blog CSS if you still want to shave render-blocking time.
4. Reassess the legacy JS/transpile warning.
5. Optionally tune third-party scripts with preconnect or delayed loading.
