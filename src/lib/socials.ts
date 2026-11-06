const socialIconByLabel = {
  Facebook: "facebook",
  Instagram: "instagram",
  LinkedIn: "linkedin",
  RSS: "rss",
  TikTok: "tiktok",
  X: "twitter-x",
  Twitter: "twitter-x",
  YouTube: "youtube",
} as const;

export type SocialIconName =
  (typeof socialIconByLabel)[keyof typeof socialIconByLabel] | "link-45deg";

/** Falls back to a generic link glyph for labels the theme has no mark for. */
export const socialIconFor = (label: string): SocialIconName =>
  socialIconByLabel[label as keyof typeof socialIconByLabel] ?? "link-45deg";
