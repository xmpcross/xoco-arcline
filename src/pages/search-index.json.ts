import { getCollection } from "astro:content";
import { authorSlug, formatDate, postHref, visiblePosts } from "@/lib/posts";

export async function GET() {
  const posts = visiblePosts(await getCollection("posts"));
  const index = posts.map((post) => ({
    title: post.data.title,
    excerpt: post.data.excerpt,
    href: postHref(post),
    category: post.data.category,
    author: post.data.author.name,
    authorHref: `/author/${authorSlug(post.data.author.name)}/`,
    tags: post.data.tags,
    date: formatDate(post.data.date),
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
