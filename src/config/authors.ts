import type { ImageMetadata } from "astro";
import evanBrooks from "@/assets/authors/evan-brooks.jpg";
import irisNovak from "@/assets/authors/iris-novak.jpg";
import leahMorgan from "@/assets/authors/leah-morgan.jpg";
import maraChen from "@/assets/authors/mara-chen.jpg";
import nicoReyes from "@/assets/authors/nico-reyes.jpg";
import samPatel from "@/assets/authors/sam-patel.jpg";

/**
 * Author portraits, keyed by the `author.name` used in post frontmatter.
 * Authors with no entry fall back to a monogram avatar, so this map is
 * optional — add a name here only once you have a photo for it.
 *
 * The bundled portraits are Unsplash placeholders of models who have no
 * connection to these fictional bylines. Replace them with photos of your
 * actual contributors before publishing. Each writer's role lives in post
 * frontmatter, not here.
 */
export interface AuthorProfile {
  image: ImageMetadata;
  creditName: string;
  creditUrl: string;
}

export const authorProfiles: Record<string, AuthorProfile> = {
  "Mara Chen": {
    image: maraChen,
    creditName: "Ayo Ogunseinde",
    creditUrl: "https://unsplash.com/photos/8VghbLlZUdQ",
  },
  "Iris Novak": {
    image: irisNovak,
    creditName: "Ryan Hoffman",
    creditUrl: "https://unsplash.com/photos/2QDYXAEfFPk",
  },
  "Evan Brooks": {
    image: evanBrooks,
    creditName: "mehdi pezhvak",
    creditUrl: "https://unsplash.com/photos/43AUR3OGt3I",
  },
  "Nico Reyes": {
    image: nicoReyes,
    creditName: "Albert Dera",
    creditUrl: "https://unsplash.com/photos/ILip77SbmOE",
  },
  "Leah Morgan": {
    image: leahMorgan,
    creditName: "Cemrecan Yurtman",
    creditUrl: "https://unsplash.com/photos/ih03D0F6M6M",
  },
  "Sam Patel": {
    image: samPatel,
    creditName: "Junior REIS",
    creditUrl: "https://unsplash.com/photos/p98UJsuyVRU",
  },
};

export const authorPortrait = (name: string): AuthorProfile | undefined => authorProfiles[name];
