# Customization Guide

Use this guide when adapting Arcline for a real publication.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It controls the site name, tagline, homepage intro headline, default metadata, canonical domain, language and date locale, contact details, social links, newsletter form settings, and navigation.

Update `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, RSS, robots, sitemap, and JSON-LD all depend on it.

Three fields are specific to this theme:

- `intro` is the display headline that opens the homepage. It is rendered as the page's `h1`, so keep it to one sentence.
- `bio` is the standfirst under the About page header, and the line under the wordmark in the footer.
- `editor` fronts the About page with a single byline. Its `name` has to match an `author.name` used in post frontmatter — the block links through to that author's archive and is skipped entirely when the name has no published posts, so a renamed masthead never leaves a dead card behind. `editor.bio` falls back to a generic line if you leave it empty.

Which posts appear in the homepage carousel is not set here — it is a per-post frontmatter flag. See [Featured Carousel](#featured-carousel).

## Categories

Categories live in one place: [src/config/categories.ts](./src/config/categories.ts). Add, remove, or rename categories there, then update demo posts so every `category` frontmatter value still matches the allowed list.

The `categoryLayouts` map in the same file controls how each category archive presents its posts. Every category must use one of three layouts:

- `featured` shows the newest post as a wide cover-beside-copy row, followed by a card grid. The lead row is only drawn on page one, so paginated archives do not repeat it.
- `grid` uses the standard three-column card grid.
- `list` displays one cover-beside-copy row per post.

Change a category's value in the map to switch its layout; no route or component duplication is required.

`categorySlug` derives URLs from the category name, lowercasing it and turning spaces and ampersands into hyphens — so `Wellness & Spas` becomes `/category/wellness-spas/`.

Navigation is generated from that same category list in [src/config/site.ts](./src/config/site.ts). `primaryNavigation` fills the slide-over sheet and `footerNavigation` fills the single row of links in the footer; both are flat arrays, so entries can be added or reordered freely.

## Newsletter

The newsletter form is intentionally provider-neutral. Configure it in `siteConfig.newsletter`:

```ts
newsletter: {
  enabled: true,
  action: "https://example.com/newsletter",
  method: "post",
  emailFieldName: "email",
}
```

The form submits only when `enabled` is `true` and `action` is non-empty. Otherwise the theme renders a clearly disabled preview. For production, connect it to your email provider or replace [src/components/SubscribeForm.astro](./src/components/SubscribeForm.astro) with provider-specific markup.

`newsletter.title` and `newsletter.description` also drive the membership band, which is rendered by [src/components/SubscribeBand.astro](./src/components/SubscribeBand.astro) and can be overridden per page with props. The band is centred: the heading, the description, and the field sit on one axis, so the copy in these fields should be short enough to read as a centred block.

## Contact Form

The contact form follows the same safe-default pattern. Configure `siteConfig.contact` with `enabled: true`, a form endpoint in `action`, and the appropriate method. Until then, every control is disabled and no visitor data can be submitted. Contact email, office lines, and response time also live in `siteConfig`.

The default email, office, and social links are presentation-friendly examples. Replace them with real publication details before production; contact and newsletter form submission remain disabled until real endpoints are explicitly enabled.

## Post Frontmatter

Every post is validated by the schema in [src/content.config.ts](./src/content.config.ts). Beyond the obvious fields, a few are worth knowing about:

- Read time is not a frontmatter field. It is counted from the post body at build time, ignoring Markdown syntax, links, and HTML, at the reading speed set by `siteConfig.wordsPerMinute` (225 by default).
- `featured: true` promotes the post into the homepage carousel. See [Featured Carousel](#featured-carousel).
- `draft: true` hides a post from every listing, feed, search index, and route.
- `cover.showInPost: false` keeps the cover for cards and social images but omits it from the article itself, so a post can run as a text-only document. Use this when a note needs cards and social images but should read as a text-led dispatch on its own page.
- `updatedDate` renders an "Updated" line under the article body and drives `dateModified` in the article's JSON-LD.
- `tags` generate tag pages and fill the chip list in the article sidebar. They are deliberately kept off the card byline, which shows the author and the category only, so a card's meta line stays one row whatever a post is tagged with.

## Featured Carousel

Promote a post into the homepage carousel from its own frontmatter:

```yaml
featured: true
```

Flagged posts run newest first. The rail is capped at six slides by `FEATURED_LIMIT` in [src/lib/posts.ts](./src/lib/posts.ts) — flag more than six and only the six newest appear. Flag fewer, and the newest unflagged posts fill the remaining slots, so a site that has flagged nothing still gets a chronological carousel instead of an empty one.

[src/components/Carousel.astro](./src/components/Carousel.astro) advances on its own every six seconds. Pass a different `duration` (in milliseconds) to change the pace:

```astro
<Carousel title="Featured posts" label="Featured posts" id="home-featured" duration={9000}>
```

The bar under the track reports position, not time: it is scaled straight from the track's `scrollLeft`, so it fills as slides go past and is full on the last one — whether the rail got there by autoplay, an arrow, or a swipe. It hides itself when every slide already fits on screen.

Autoplay pauses on hover, on keyboard focus, and while the tab is hidden, and the current slide gets a full turn again whenever the reader takes over with an arrow or a swipe. Readers who set `prefers-reduced-motion` get no autoplay at all, but keep the bar and a swipeable track. Both arrows wrap, so the rail never dead-ends.

The track spans the full page width and indents its first slide to the container gutter using percentages of its parent rather than `100vw`, which counts the scrollbar and would give the page a horizontal scrollbar.

## Browse by Category

The card row under the latest grid is generated from the category config, not from anything per-post. `getCategoryShelves` in [src/lib/posts.ts](./src/lib/posts.ts) walks `categories` in declared order — so the row matches the navigation rather than the publishing schedule — and gives each one a post count, the description already written in `categoryMeta`, and the cover of its newest post as artwork.

Categories with nothing published drop out of the row instead of rendering a card that leads to an empty archive, so a new category can be declared before its first post is written. To reorder or rename the row, edit `categories` and `categoryMeta` in [src/config/categories.ts](./src/config/categories.ts); to remove the section, drop `<CategoryShelves />` from [src/pages/index.astro](./src/pages/index.astro).

## Popular Tags

The row of tiles between the category row and the membership band on the homepage is generated, not configured. `getTopTags` in [src/lib/posts.ts](./src/lib/posts.ts) ranks every tag by how many published posts carry it, takes the top five, and shows the count on each tile. Ties break alphabetically so the order does not shuffle between builds.

Each tile borrows the cover of that tag's newest post as its artwork, so the row stays current on its own. Tags overlap heavily in practice, so a tag whose newest post has already been claimed by an earlier tile steps to its next post instead — no photograph appears twice in the row.

Change the count with the `limit` argument, or drop `<TagTiles />` from [src/pages/index.astro](./src/pages/index.astro) to remove the section entirely.

## Table of Contents

The article sidebar builds its contents list from the second-level headings (`##`) Astro extracts while rendering the post, so nothing needs to be maintained by hand. Anchors come from `rehype-slug`. Posts with fewer than two sections render no contents block at all.

The entries hang off a single vertical rule rather than sitting between horizontal ones, and a short marker rides that rule to show where the reader is. A small IntersectionObserver in [src/components/TableOfContents.astro](./src/components/TableOfContents.astro) marks the current section with `aria-current="location"` and moves the marker to it, measuring the live entry so a heading that wraps to two lines gets a segment its own length. It re-measures on resize.

The observer is skipped entirely for readers who ask for reduced motion, which leaves the marker with nothing to place — the rail stays unbroken and the current entry is carried in type weight instead.

## Sharing

The article sidebar carries a single share control. It opens a small dialog listing X, Facebook, LinkedIn, email, and the post's own link with a copy button. On a phone, where the browser offers a share sheet, a full-width **More apps** row appears above the link and hands off to it — that is where Messages, WhatsApp, and everything else the reader actually has installed live.

Every channel is a plain link to that network's share endpoint. No third-party script is loaded and no tracking pixel is embedded, so the dialog costs nothing until it is opened. The dialog itself is a native `<dialog>`, so focus trapping, Escape, and the backdrop come from the browser rather than from theme JavaScript.

To add a channel, edit the `channels` array in [src/components/ShareButton.astro](./src/components/ShareButton.astro):

```ts
{
  label: "Pinterest",
  icon: "pinterest" as const,
  href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
},
```

The `icon` name has to resolve in [src/components/LocalIcon.astro](./src/components/LocalIcon.astro), so drop the mark into [src/icons/bootstrap](./src/icons/bootstrap) and register it there first — see [Icons](#icons). Channels that post an image, Pinterest among them, also want a `media=` parameter; the post page already computes an absolute cover URL for its metadata and can pass it in as a prop.

If the clipboard is unavailable the copy button selects the link instead of reporting a failure, so the reader can still take it with a keyboard.

## Images

Posts keep images next to each Markdown file. Each cover needs useful alt text and a credit URL. Relative images used inside the Markdown body go through Astro's image pipeline too, so `![alt](./detail.jpg)` is optimized like a cover. Astro optimizes theme-controlled images during build, but source images should still be reasonably sized before shipping a production site.

### Captions and photo credits

Covers carry a credit from their `creditName` and `creditUrl` frontmatter. In-body images take theirs from the image's own title slot, and [src/lib/rehype-figure-credit.ts](./src/lib/rehype-figure-credit.ts) turns those into a `<figure>` with a `<figcaption>` while the image stays in Astro's pipeline:

```md
![alt text](./detail.jpg "A caption sentence.")
![alt text](./detail.jpg "Photographer Name | https://example.com/photo")
![alt text](./detail.jpg "A caption sentence. | Photographer Name | https://example.com/photo")
```

Fields are separated by `|`. One field is a caption. Two fields are a bare credit when the second is a URL, so a caption containing a pipe is not mistaken for one. Three fields give you both. The credit renders as `Photo by <name>`, linked when a URL is present, on its own line under the caption.

Untitled images are left exactly as they were — a plain `<img>` in a paragraph — so nothing needs rewriting to keep the old behaviour. Writing a `<figure>` by hand in Markdown still works too, but raw HTML never reaches the image pipeline, so point those at a file in `public/` and size them yourself.

### Sizing in-body images

The reading column is capped at `--reading` (38.75rem, or 620px), so an in-body image never displays wider than that. The bundled demo details are 1240px — twice the column, which covers high-density screens exactly — and that is the size worth matching. Markdown images are served as a single optimized file rather than a `srcset`, because a fixed-width column has no meaningful breakpoints to switch between; set `image.layout` in [astro.config.mjs](./astro.config.mjs) if you want Astro's responsive markdown images anyway, and check the card styles afterwards, since that setting is global.

## Article Prose

The reading column in [src/styles/global.css](./src/styles/global.css) styles the Markdown an editorial post actually uses: paragraphs, `h2` to `h4`, unordered and ordered lists, `strong`, links, blockquotes with `cite`, captioned figures, images, and horizontal rules. The demo posts exercise these, so the styles are visible in the live preview rather than only in the stylesheet. Markdown tables are the one thing the column does not style; add rules for `.prose table` if your publication needs them.

Two conventions are worth keeping when you replace the demo content:

- Only `##` headings enter the contents rail, so `###` is free for sub-points inside a section without lengthening the sidebar.
- A pull-quote reads best as a `blockquote` with a `<cite>` line attributing it, which is styled as a block under the quote:

```md
> Privacy is the luxury. The pool is only the proof.
>
> <cite>Leah Morgan, on what the category names leave out</cite>
```

Internal links between posts use the site's own post path, `/post/<slug>/`, with the trailing slash — the same shape `postHref` generates for cards, so archive links and in-body links stay consistent.

Arcline ships **no syntax highlighting and no code-block styling**: it is an editorial theme, and `markdown.syntaxHighlight` is set to `false` in [astro.config.mjs](./astro.config.mjs) so no highlighter is bundled. A fenced block still renders as plain `<pre><code>`, but it inherits nothing from the reading column. If your publication needs code, set `syntaxHighlight` to `"shiki"`, add a `shikiConfig` theme, and style `.astro-code` (plus `overflow-x: auto` on it, so long lines scroll instead of widening the column).

## Icons

Social and share icons are hosted locally in [src/icons/bootstrap](./src/icons/bootstrap) and rendered through [src/components/LocalIcon.astro](./src/components/LocalIcon.astro). To add a new social network, add its SVG to that folder, register it in the `icons` map in `LocalIcon.astro`, then map the `siteConfig.socials` label to that icon name in [src/lib/socials.ts](./src/lib/socials.ts). Labels with no mapping fall back to a generic link glyph.

The bundled SVGs come from Bootstrap Icons and include their MIT license notice in the icon folder.

Editorial UI icons — arrows, chevron, search, theme toggle, close, share, envelope — are drawn inline by [src/components/ui/Icon.astro](./src/components/ui/Icon.astro) instead, so no icon font or sprite is requested. Add one by extending the `IconName` union and adding a matching branch in the same file.

## Pages

Core static pages live in [src/pages](./src/pages):

- `about.astro`
- `contact.astro`
- `privacy.astro`

Replace the starter copy with publication-specific masthead, advertising, privacy, and legal information.

## Archives and Pagination

Every archive paginates, so no route grows without limit as a publication fills up:

| Archive  | Route                                           | Page one             | Later pages            |
| -------- | ----------------------------------------------- | -------------------- | ---------------------- |
| All      | `src/pages/posts/[...page].astro`               | `/posts/`            | `/posts/2/`            |
| Category | `src/pages/category/[category]/[...page].astro` | `/category/dining/`  | `/category/dining/2/`  |
| Tag      | `src/pages/tag/[tag]/[...page].astro`           | `/tag/suites/`       | `/tag/suites/2/`       |
| Author   | `src/pages/author/[author]/[...page].astro`     | `/author/mara-chen/` | `/author/mara-chen/2/` |

Page one keeps the bare archive URL, so links and canonicals do not change when an archive outgrows a single page. All four use `pageSize: 12`; change it in the route's `paginate` call, and note that the category archive's `featured` layout spends one of those twelve slots on its lead row.

Each page passes its neighbours to [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) as `prevUrl` and `nextUrl` for `rel="prev"`/`rel="next"`, and renders [src/components/Pagination.astro](./src/components/Pagination.astro) at the foot of the grid. That component hides itself when there is only one page, and renders the unavailable direction as a disabled `span` rather than a dead link. Astro's paginator omits trailing slashes, so all four routes normalise their URLs through `withTrailingSlash` in [src/lib/posts.ts](./src/lib/posts.ts).

Tag and author pages also carry their totals in the header line — `18 posts tagged Suites`, `4 articles` — with the current page appended once there is more than one.

## Search

Arcline includes static, client-side search with no database or hosted search service. The search field at the bottom of the navigation sheet in [src/components/SiteHeader.astro](./src/components/SiteHeader.astro) opens a command palette, while [src/pages/search.astro](./src/pages/search.astro) provides the full `/search/?q=...` results page.

At build time, [src/pages/search-index.json.ts](./src/pages/search-index.json.ts) generates `/search-index.json` from every published post. The index contains the post title, excerpt, category, author, tags, date, and URL; it does not contain the full article body. Opening the command palette loads this index on demand, ranks title matches ahead of supporting metadata matches, and displays up to seven results. The full search page reads the `q` URL parameter and renders all matching posts.

Search can be opened from the navigation sheet or with `Ctrl + K` on Windows and Linux, `Command + K` on macOS, or `/` while focus is outside a form control. Use the arrow keys to move through command-palette results and `Escape` to close it.

This approach is a good fit for publications with a few hundred posts and should remain comfortable around 1,000 posts. For several thousand pages, full-body search, multilingual search, or richer filtering, consider replacing the built-in index with [Pagefind](https://pagefind.app/). It is intentionally not included as a default dependency.

Because Arcline's built-in index is generated statically, newly published or edited posts become searchable after the next site build.

## Theme Tokens

Global colours, typography, radii, focus styles, dark mode, and motion rules live in [src/styles/global.css](./src/styles/global.css). Prefer editing the tokens near the top of that file before changing individual components.

The palette is deliberately small: `--page` (warm paper), `--surface` (cards), `--chip`, `--line`, `--ink`, `--ink-dim`, and `--control`/`--control-ink` for the black pill buttons. `--font-mono` is used only for the keyboard hints and the empty-state glyph in the search palette; with code blocks gone it is the theme's sole monospace use. Each has a companion for its hover or emphasis state where one is needed — `--chip-hover`, `--line-strong` — plus the `--overlay-*` values used over photography. The dark palette overrides the same names under `:root[data-theme="dark"]`, and inverts `--control` so the pill stays legible on a near-black page.

The theme is written in plain CSS with these tokens, not in utility classes, so most changes happen in `global.css`. The `@theme inline` block at the top of the file does mirror the tokens into Tailwind's namespace, so `bg-surface`, `text-ink-dim`, `rounded-lg`, and `font-mono` are available if you prefer to reach for a utility in your own additions.

## Fonts

Arcline self-hosts [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) (OFL) from `public/fonts/be-vietnam-pro` in weights 400, 500, and 600, each split into latin and latin-ext subsets behind a `unicode-range`. `--font-mono` uses Geist Mono, from `public/fonts/geist`, for the search palette's keyboard hints — the theme's only monospace text. It is a single variable file and is only fetched once the palette is opened, so drop it and let `--font-mono` fall back to `ui-monospace` if you would rather not ship it at all.

Only the 400 and 500 latin files are preloaded in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro), because those two weights carry the above-the-fold headline and controls. To swap typefaces, replace the `@font-face` rules and the `--font-sans` token at the top of [src/styles/global.css](./src/styles/global.css), drop your own files in `public/fonts`, and update the preload tags.

Sizes come from the `--fs-*` scale in `:root`, which steps up at the `40rem` and `64rem` breakpoints — change the scale there rather than per component.

## Scroll Reveal

Add the `reveal` class to any section to have it fade and rise into view as it scrolls into the viewport. Elements are fully visible without JavaScript or when the visitor has `prefers-reduced-motion` set; the reveal only activates progressively via a small IntersectionObserver script in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro). Avoid adding it to the intro or other above-the-fold content, since it delays first paint of content visitors already see on load.
