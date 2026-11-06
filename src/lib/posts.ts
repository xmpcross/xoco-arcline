import type { CollectionEntry } from "astro:content";
import { categories, categoryMeta, categorySlug, type Category } from "@/config/categories";
import { siteConfig } from "@/config/site";

export type Post = CollectionEntry<"posts">;
export { categories, categorySlug, type Category };

export const categoryFromSlug = (slug: string): Category | undefined =>
  categories.find((category) => categorySlug(category) === slug);

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/** Monogram fallback for authors with no portrait in `src/config/authors.ts`. */
export const authorInitials = (author: string) =>
  author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const authorSlug = (author: string) =>
  author
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const postSlug = (post: Post) => post.id.replace(/\/index$/, "");

export const postHref = (post: Post) => `/post/${postSlug(post)}/`;

/**
 * Astro's paginator returns page URLs without a trailing slash, so every
 * archive normalises them before they reach `rel="prev"`/`rel="next"` and the
 * pager. Keeping it here means all four paginated routes agree.
 */
export const withTrailingSlash = (url: string | undefined) =>
  url && !url.endsWith("/") ? `${url}/` : url;

export const byNewest = (a: Post, b: Post) => b.data.date.getTime() - a.data.date.getTime();

export const visiblePosts = (posts: Post[]) =>
  posts.filter((post) => !post.data.draft).sort(byNewest);

export const excludePosts = (posts: Post[], excluded: Post[]) => {
  const excludedIds = new Set(excluded.map((post) => post.id));
  return posts.filter((post) => !excludedIds.has(post.id));
};

export const getByCategory = (posts: Post[], category: Category, limit?: number) => {
  const list = visiblePosts(posts).filter((post) => post.data.category === category);
  return typeof limit === "number" ? list.slice(0, limit) : list;
};

/**
 * One entry per category that has something published, in the order
 * `categories` declares them — the row should match the site's own sense of
 * itself, not the publishing schedule. Each shelf borrows the cover of its
 * newest post and the description already written in `categoryMeta`, so the
 * section stays current with nothing to maintain by hand. Empty categories drop
 * out rather than rendering a shelf that leads to "More posts are coming soon."
 */
export const getCategoryShelves = (posts: Post[]) => {
  const visible = visiblePosts(posts);

  return categories.flatMap((category) => {
    const list = visible.filter((post) => post.data.category === category);
    // `visiblePosts` is newest-first, so the first match is the latest.
    const newest = list[0];
    if (!newest) return [];

    return [
      {
        category,
        slug: categorySlug(category),
        description: categoryMeta[category].description,
        count: list.length,
        cover: newest.data.cover,
      },
    ];
  });
};

/** Hard ceiling on the homepage carousel, whatever the frontmatter asks for. */
export const FEATURED_LIMIT = 6;

/**
 * Featured carousel: every post marked `featured: true` in frontmatter, newest
 * first, then the newest remaining posts to fill the rail — so a site that has
 * flagged nothing still gets a chronological carousel rather than an empty one.
 */
export const getFeatured = (posts: Post[], limit = FEATURED_LIMIT) => {
  const visible = visiblePosts(posts);
  const flagged = visible.filter((post) => post.data.featured);
  return [...flagged, ...excludePosts(visible, flagged)].slice(0, Math.min(limit, FEATURED_LIMIT));
};

export const getRelated = (posts: Post[], current: Post, limit = 3) =>
  visiblePosts(posts)
    .filter((post) => post.id !== current.id)
    .sort((a, b) => {
      const categoryScore =
        Number(b.data.category === current.data.category) -
        Number(a.data.category === current.data.category);
      return categoryScore || byNewest(a, b);
    })
    .slice(0, limit);

/**
 * Tags ranked by how many posts carry them. Each one borrows the cover of its
 * newest post as artwork, so the tiles stay in step with what has been
 * published without anything to maintain by hand. Ties break alphabetically so
 * the order does not shuffle between builds.
 */
export const getTopTags = (posts: Post[], limit = 5) => {
  const visible = visiblePosts(posts);
  const byTag = new Map<string, { label: string; posts: Post[] }>();

  visible.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const slug = tagSlug(tag);
      const entry = byTag.get(slug);
      if (entry) entry.posts.push(post);
      else byTag.set(slug, { label: tag, posts: [post] });
    });
  });

  const ranked = Array.from(byTag.entries())
    .map(([slug, entry]) => ({
      slug,
      label: entry.label,
      count: entry.posts.length,
      posts: entry.posts,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);

  // Neighbouring tags often share their newest post. Stepping to that tag's
  // next post keeps the row from showing the same photograph twice.
  const used = new Set<string>();

  return ranked.map(({ posts, ...tag }) => {
    // `visiblePosts` is newest-first, so the first match is the latest.
    const pick = posts.find((post) => !used.has(post.id)) ?? posts[0]!;
    used.add(pick.id);
    return { ...tag, cover: pick.data.cover };
  });
};

export const getAllTags = (posts: Post[]) =>
  Array.from(new Set(visiblePosts(posts).flatMap((post) => post.data.tags))).sort((a, b) =>
    a.localeCompare(b),
  );

export const getAllAuthors = (posts: Post[]) =>
  Array.from(
    visiblePosts(posts)
      .reduce((authorMap, post) => {
        const slug = authorSlug(post.data.author.name);
        const current = authorMap.get(slug);
        authorMap.set(slug, {
          name: post.data.author.name,
          role: post.data.author.role,
          posts: [...(current?.posts ?? []), post],
        });
        return authorMap;
      }, new Map<string, { name: string; role: string; posts: Post[] }>())
      .entries(),
  )
    .map(([slug, author]) => ({ slug, ...author }))
    .sort((a, b) => a.name.localeCompare(b.name));

/** Words for the read-time count: letters and digits, apostrophes and hyphens kept intact. */
const wordPattern = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

/**
 * Read time estimated from the Markdown body at build time, so posts never
 * carry a hand-maintained number in frontmatter. Code blocks, HTML tags, URLs,
 * and Markdown punctuation are dropped first so only prose is counted, and
 * every post reads as at least a minute.
 */
export const readMinutes = (post: Post) => {
  const prose = (post.body ?? "")
    .replace(/^---\n[\s\S]*?\n---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}\[[^\]]+\]:.*$/gm, " ");
  const words = prose.match(wordPattern)?.length ?? 0;
  return Math.max(1, Math.round(words / siteConfig.wordsPerMinute));
};

export const formatDate = (date: Date, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat(siteConfig.dateLocale, {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
