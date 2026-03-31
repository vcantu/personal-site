import { Hono } from "hono";
import { db } from "../db.ts";
import { blogPosts } from "../schema.ts";
import { eq, desc } from "drizzle-orm";

export const blogRoute = new Hono();

// GET /api/blog - list all posts (newest first)
blogRoute.get("/blog", async (c) => {
  const posts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      emoji: blogPosts.emoji,
      tag: blogPosts.tag,
      excerpt: blogPosts.excerpt,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt));

  return c.json(posts);
});

// GET /api/blog/:slug - get single post by slug
blogRoute.get("/blog/:slug", async (c) => {
  const slug = c.req.param("slug");
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});
