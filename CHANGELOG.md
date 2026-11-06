# Changelog

All notable changes to Arcline are documented here.

## 1.0.1 - 2026-10-21

- Updated Astro to 7.4.1 and other dependencies.
- Added `AGENTS.md` with guidance for AI coding assistants.
- Files check out with LF line endings on every platform.

## 1.0.0 - 2026-08-04

- Initial commercial release.
- Editorial homepage with a display intro, a scroll-snap featured carousel that bleeds off the page edge, a three-column latest-posts grid, a generated category row, a popular-tags row, and a membership band.
- Article pages with a full-width cover and credit chip, a sticky sidebar carrying the byline, an auto-generated contents rail with a sliding scroll-spy marker, tag chips, a share dialog offering X, Facebook, LinkedIn, email, a copy-link field, and the device's own share sheet where one exists, and a related-posts row.
- Slide-over navigation sheet with a focus trap, and a keyboard-friendly command palette opened from the sheet or with `Ctrl`/`Cmd + K` and `/`.
- Configurable per-category archive layouts: featured, grid, and editorial list.
- Category, tag, author, archive, search, about, contact, privacy, and 404 pages.
- Read time calculated from the article body at build time at a configurable reading speed, so no post carries it in frontmatter.
- Markdown content collections with validated frontmatter, and a reading column that styles headings, lists, pull-quotes with `cite`, captioned figures, and links.
- In-body images run through Astro's image pipeline, with an optional caption and linked photo credit taken from the Markdown image's title slot.
- Warm-paper design system with white card surfaces and one black control colour, plus a matching dark palette that inverts the pill controls.
- Self-hosted Be Vietnam Pro in three weights and two subsets, and Geist Mono for the search palette's keyboard hints — no external font requests.
- Responsive Astro images for theme-controlled story images, canonical URLs, sitemap, RSS, Open Graph, Twitter/X cards, and JSON-LD.
- Accessible skip link, landmarks, focus states, focus trapping, and reduced-motion support.
- Provider-neutral newsletter and contact form configuration.
