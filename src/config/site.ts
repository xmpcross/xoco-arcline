import { categories, categorySlug } from "./categories";

export const siteConfig = {
  name: "Arcline",
  tagline: "Luxury travel, edited with restraint.",
  title: "Arcline - A minimal Astro theme for luxury travel publications",
  description:
    "An Astro theme for luxury travel writing: refined typography, generous resort photography, and a reading column built for considered features.",
  siteUrl: "https://arcline.xocoweb.workers.dev",
  authorName: "Andrei Alba",
  email: "hello@example.com",
  language: "en",
  dateLocale: "en-US",
  /**
   * Reading speed used to estimate the "min read" line on articles. Read time
   * is counted from the post body at build time, so no post carries it in
   * frontmatter. Lower it for denser, more technical writing.
   */
  wordsPerMinute: 225,
  locale: "en_US",
  socialImage: "/og-image.png",
  /** Headline that opens the homepage. Keep it to one sentence. */
  intro: "Luxury travel notes for suites, tables, escapes, and quiet arrivals.",
  /** Short bio shown in the footer and under the About page header. */
  bio: "A luxury travel publication about the details that make a stay feel composed: the suite, the table, the transfer, the spa hour, and the service choice that changes the day.",
  /**
   * The byline that fronts the About page. `name` has to match an
   * `author.name` used in post frontmatter: the block links to that author's
   * archive and is skipped entirely when the name has no published posts.
   */
  editor: {
    name: "Mara Chen",
    title: "Who runs it",
    /** Shown under the byline on the About page. Falls back to a generic line. */
    bio: "Mara edits the desk and still files on hotels, arrivals, and city luxury. Her briefs are deliberately exact: name the promise, test the service, explain what is worth paying for, and say what only looked expensive.",
  },
  newsletter: {
    enabled: false,
    action: "",
    method: "post",
    emailFieldName: "email",
    title: "Get the next dispatch",
    description:
      "A concise luxury travel letter most Fridays: new hotel notes, restaurant calls, planning briefs, and one service detail worth remembering.",
    terms:
      "We send the letter and nothing else. Leave at any time; the privacy page covers how your address is handled.",
  },
  contact: {
    enabled: false,
    action: "",
    method: "post",
    office: ["124 Cais do Sodre", "Lisbon 1200-161"],
    responseTime: "Usually within two business days.",
  },
  socials: [
    { label: "X", href: "https://x.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "TikTok", href: "https://www.tiktok.com" },
    { label: "YouTube", href: "https://www.youtube.com" },
  ],
};

export const categoryNavigation = categories.map((category) => ({
  label: category,
  href: `/category/${categorySlug(category)}/`,
}));

/**
 * The navigation sheet is a flat list, so categories and publication pages sit
 * in one column. Add or reorder entries freely; nothing depends on the count.
 */
export const primaryNavigation: { label: string; href: string }[] = [
  ...categoryNavigation,
  { label: "Authors", href: "/author/" },
  { label: "Our story", href: "/about/" },
];

/** Single row of links in the footer, opposite the wordmark. */
export const footerNavigation: { label: string; href: string }[] = [
  { label: "All posts", href: "/posts/" },
  { label: "Authors", href: "/author/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "RSS", href: "/rss.xml" },
];
