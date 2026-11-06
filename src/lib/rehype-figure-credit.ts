/**
 * Gives in-body Markdown images a caption and a photo credit without taking
 * them out of Astro's image pipeline.
 *
 * A Markdown image renders as a bare `<img>` inside a paragraph, which leaves
 * nowhere to attribute a photographer — the cover gets that from frontmatter,
 * but images inside the article had no equivalent. Hand-writing a `<figure>` in
 * Markdown solves the caption and loses the optimisation, since raw HTML never
 * reaches the pipeline.
 *
 * So the credit rides in the image's own title slot, and this plugin turns the
 * paragraph into a figure after the image has already been collected for
 * optimisation. Only the surrounding markup changes; `src` and `alt` are left
 * exactly as Astro produced them.
 *
 *   ![alt](./detail.jpg "Caption sentence.")
 *   ![alt](./detail.jpg "Photographer Name | https://example.com/photo")
 *   ![alt](./detail.jpg "Caption sentence. | Photographer Name | https://example.com/photo")
 *
 * Untitled images are left alone, so existing posts keep the plain `<img>` the
 * reading column already styles.
 */

/**
 * The slice of hast this plugin touches. Declared locally because the theme
 * does not otherwise depend on the hast type packages.
 */
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

interface FigureCredit {
  caption?: string;
  creditName?: string;
  creditUrl?: string;
}

const isUrl = (value: string) => /^https?:\/\//i.test(value);

/**
 * Reads the title slot. Two fields are a bare credit when the second is a URL,
 * so a caption that happens to contain a pipe is not mistaken for one.
 */
const parseTitle = (title: string): FigureCredit | null => {
  const parts = title
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const [first, second, third] = parts;

  if (!first) return null;
  if (parts.length === 1) return { caption: first };

  if (parts.length === 2) {
    return second && isUrl(second)
      ? { creditName: first, creditUrl: second }
      : { caption: first, creditName: second };
  }

  return third && isUrl(third)
    ? { caption: first, creditName: second, creditUrl: third }
    : { caption: first, creditName: second };
};

const textNode = (value: string): HastNode => ({ type: "text", value });

const captionChildren = ({ caption, creditName, creditUrl }: FigureCredit): HastNode[] => {
  const children = caption ? [textNode(caption)] : [];
  if (!creditName) return children;

  children.push({
    type: "element",
    tagName: "span",
    properties: { className: ["figure-credit"] },
    children: [
      textNode("Photo by "),
      creditUrl
        ? {
            type: "element",
            tagName: "a",
            properties: { href: creditUrl, rel: ["noreferrer"] },
            children: [textNode(creditName)],
          }
        : textNode(creditName),
    ],
  });

  return children;
};

/** A paragraph holding nothing but one image is the figure candidate. */
const imageOnlyParagraph = (node: HastNode): HastNode | null => {
  if (node.type !== "element" || node.tagName !== "p" || !node.children) return null;

  const meaningful = node.children.filter(
    (child) => child.type !== "text" || (child.value ?? "").trim() !== "",
  );
  const [only] = meaningful;

  return meaningful.length === 1 && only?.type === "element" && only.tagName === "img"
    ? only
    : null;
};

const toFigure = (image: HastNode, credit: FigureCredit): HastNode => ({
  type: "element",
  tagName: "figure",
  properties: {},
  children: [
    image,
    {
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: captionChildren(credit),
    },
  ],
});

export default function rehypeFigureCredit() {
  const transform = (node: HastNode): void => {
    if (!node.children) return;

    node.children = node.children.map((child) => {
      transform(child);

      const image = imageOnlyParagraph(child);
      const title = image?.properties?.["title"];
      const credit = typeof title === "string" ? parseTitle(title) : null;
      if (!image || !credit) return child;

      // The caption now carries the text, so keeping the attribute would only
      // repeat it as a hover tooltip.
      delete image.properties?.["title"];

      return toFigure(image, credit);
    });
  };

  return (tree: HastNode) => transform(tree);
}
