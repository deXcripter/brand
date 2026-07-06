import { apiFetch, serverApiFetch } from "@/lib/api-client";
import type {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/lib/types";

export type { BlogPost } from "@/lib/types";

export async function getAllPosts(): Promise<BlogPost[]> {
  return serverApiFetch<BlogPost[]>("/posts");
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  try {
    return await serverApiFetch<BlogPost>(`/posts/${slug}`);
  } catch {
    return undefined;
  }
}

export async function getAdminPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>("/admin/posts", { auth: true });
}

export async function getAdminPost(slug: string): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/admin/posts/${slug}`, { auth: true });
}

export async function createPost(input: CreateBlogPostInput): Promise<BlogPost> {
  return apiFetch<BlogPost>("/admin/posts", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function updatePost(
  slug: string,
  input: UpdateBlogPostInput
): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/admin/posts/${slug}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function deletePost(slug: string): Promise<void> {
  await apiFetch<void>(`/admin/posts/${slug}`, {
    method: "DELETE",
    auth: true,
  });
}
