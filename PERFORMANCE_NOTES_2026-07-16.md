# Performance Notes (Actionable)
Date: 2026-07-16
Scope: frontend (Next.js app)

## Executive summary
The largest real bottlenecks are:
1. Duplicate Google Font loading (local next/font + remote Google CSS in head).
2. Very large homepage card background images (about/journey/gallery).
3. Optional third-party scripts loading on every page.

The polyfill warning is likely mostly framework/runtime level and lower-impact than the image/font issues.

## Priority 0 (fix first)

### P0.1 Remove duplicate remote Google Fonts requests
Evidence:
- next/font already configured in src/app/layout.tsx line 2.
- Manual Google Fonts preconnect and stylesheet are also present in src/app/layout.tsx lines 45-49.

Why this matters:
- Duplicates font loading paths.
- Adds an extra external request chain (fonts.googleapis.com -> fonts.gstatic.com).
- Matches PSI report showing Google Fonts CSS latency.

Action:
- Keep next/font/google usage.
- Remove the manual head tags:
  - <link rel="preconnect" href="https://fonts.googleapis.com" />
  - <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  - <link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" />

Expected impact:
- Fewer critical requests.
- Lower font-related blocking.
- Should remove "unused preconnect" warnings caused by the manual links.

### P0.2 Convert heavy PNG backgrounds to modern compressed assets
Evidence:
- File sizes:
  - public/about_bg.png = 647K
  - public/journey_bg.png = 656K
  - public/gallery_bg.png = 583K
- These are directly used in homepage explore cards at:
  - src/app/page.tsx line 65
  - src/app/page.tsx line 80
  - src/app/page.tsx line 95

Why this matters:
- PSI estimates ~1.3MB savings from these three images alone.
- These requests directly affect perceived load and LCP behavior.

Action:
- Create WebP or AVIF versions for each image.
- Preferred: move from CSS background-image to next/image with responsive sizes and lazy loading where possible.
- If keeping CSS backgrounds, at least switch URLs to compressed WebP/AVIF and provide fallback.

Expected impact:
- Largest single gain in transfer size and perceived speed.

## Priority 1 (next)

### P1.1 Reduce font payload further (especially JetBrains Mono)
Evidence:
- JetBrains Mono currently declares multiple weights in src/app/layout.tsx line 16.

Why this matters:
- Multiple weights can increase font bytes.

Action:
- Evaluate whether all weights are needed.
- Use fewer weights, or use variable configuration if available for this font in next/font.
- Keep display: swap.

Expected impact:
- Smaller font payload and faster text stabilization.

### P1.2 Defer or conditionally load non-critical third-party scripts
Evidence:
- Scripts loaded globally in src/app/layout.tsx:
  - src/app/layout.tsx line 53 (exeolabs)
  - src/app/layout.tsx line 60 (plausible)

Why this matters:
- Small today, but third-party scripts add variability and can delay/compete for main-thread/network resources.

Action:
- Keep afterInteractive, but consider delaying analytics until idle or after consent/interaction if acceptable.
- Optionally load only in production environments.

Expected impact:
- Small-to-moderate improvement in early page interactivity stability.

## Priority 2 (validate and harden)

### P2.1 Re-check legacy/polyfill warning after P0 fixes
Evidence:
- PSI shows "legacy JavaScript/polyfills" including Array/Object/String features in a first-party chunk.

Assessment:
- In modern Next.js, some runtime/polyfill code can still appear in bundles.
- This is usually less important than image/font bottlenecks unless bundle analysis shows a large avoidable app-level polyfill import.

Action:
- Run a production bundle analysis after P0/P1 changes.
- Confirm there is no direct app import of polyfill libraries.
- If needed, set a modern browserslist target and verify compatibility policy before tightening targets.

Expected impact:
- Likely modest compared with image/font fixes.

## Not directly addressable in app code (or low ROI now)
- Third-party cache TTL values reported by PSI for external analytics hosts are mostly controlled by those providers.
- Minor forced reflow note (60ms unattributed) is currently not traceable to obvious layout-read APIs in app components.

## Suggested implementation order
1. Remove manual Google font links/preconnect in layout.
2. Compress and replace the three homepage background images.
3. Re-test Lighthouse/PageSpeed in production.
4. Tune font weights and optional analytics deferral.
5. Re-assess polyfill warning only if still material.

## Verification checklist
- No request to fonts.googleapis.com in first load (unless intentionally kept).
- Homepage image transfer size significantly reduced.
- LCP and FCP improve in PSI.
- No visual regression in headings/body typography.
- Explore cards still render correctly on desktop/mobile.
