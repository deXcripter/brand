import { apiFetch, getApiUrl, serverApiFetch } from "@/lib/api-client";
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
  const response = await fetch(`${getApiUrl()}/posts/${slug}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return (await response.json()) as BlogPost;
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
