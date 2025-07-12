import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishedAt: z.string().optional(),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000),
  postId: z.string(),
  parentId: z.string().optional(),
})

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})