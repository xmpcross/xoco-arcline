export const categories = [
  "Hotels & Resorts",
  "Private Escapes",
  "City Luxury",
  "Wellness & Spas",
  "Dining",
  "Planning",
] as const;

export type Category = (typeof categories)[number];

/**
 * Controls how each category page presents its posts:
 * - "featured": the newest post as a wide lead row, followed by a card grid
 * - "grid": the standard card grid
 * - "list": one image-beside-copy editorial row per post
 */
export type CategoryLayout = "featured" | "grid" | "list";

export const categoryLayouts: Record<Category, CategoryLayout> = {
  "Hotels & Resorts": "featured",
  "Private Escapes": "grid",
  "City Luxury": "grid",
  "Wellness & Spas": "featured",
  Dining: "list",
  Planning: "list",
};

export const categorySlug = (category: Category) =>
  category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s+/g, "-");

export const categoryMeta: Record<Category, { description: string }> = {
  "Hotels & Resorts": {
    description:
      "Suites, pool villas, island resorts, and grand hotels judged by comfort, privacy, service, and the details that survive beyond the brochure.",
  },
  "Private Escapes": {
    description:
      "Yachts, lodges, cruises, and private arrangements where the value is space, timing, discretion, and a plan that feels completely your own.",
  },
  "City Luxury": {
    description:
      "Urban luxury through lobbies, lounges, aviation, transfers, shopping districts, and the rooms that make a city feel effortless.",
  },
  "Wellness & Spas": {
    description:
      "Spa menus, recovery days, thermal circuits, treatment timing, and the quiet rituals that make a luxury stay feel restorative.",
  },
  Dining: {
    description:
      "Room service, tasting menus, terrace breakfasts, cellar choices, and reservations that turn a beautiful trip into a memorable one.",
  },
  Planning: {
    description:
      "Concierge briefs, packing lists, arrival plans, loyalty perks, and the small decisions that make high-end travel feel calm instead of busy.",
  },
};
