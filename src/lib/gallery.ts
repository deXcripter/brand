import { apiFetch, getApiUrl, serverApiFetch } from "@/lib/api-client";
import type {
  CreateGalleryImageInput,
  GalleryGroup,
  GalleryImage,
  PaginatedGalleryResponse,
  UpdateGalleryImageInput,
  UploadResponse,
} from "@/lib/types";
import { formatMonthLabel } from "@/lib/gallery-date";

export type { GalleryImage, GalleryGroup, PaginatedGalleryResponse } from "@/lib/types";

function groupImages(images: GalleryImage[]): GalleryGroup[] {
  const grouped = new Map<string, GalleryImage[]>();

  for (const image of images) {
    const label = formatMonthLabel(new Date(image.date));
    const bucket = grouped.get(label) ?? [];
    bucket.push(image);
    grouped.set(label, bucket);
  }

  return Array.from(grouped.entries()).map(([month, monthImages]) => ({
    month,
    images: monthImages,
  }));
}

export async function getGalleryGroups(): Promise<GalleryGroup[]> {
  const data = await serverApiFetch<PaginatedGalleryResponse>("/gallery");
  return groupImages(data.images);
}

/** Fetch the next page of gallery images (client-side, cursor-based). */
export async function fetchGalleryBatch(
  cursorDate?: string,
  cursorId?: string
): Promise<PaginatedGalleryResponse> {
  const params = new URLSearchParams();
  if (cursorDate) params.set("cursorDate", cursorDate);
  if (cursorId) params.set("cursorId", cursorId);

  const qs = params.toString();
  const url = `${getApiUrl()}/gallery${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as PaginatedGalleryResponse;
}

export async function getAdminGalleryImages(): Promise<GalleryImage[]> {
  return apiFetch<GalleryImage[]>("/admin/gallery", { auth: true });
}

export async function createGalleryImage(
  input: CreateGalleryImageInput
): Promise<GalleryImage> {
  return apiFetch<GalleryImage>("/admin/gallery", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function updateGalleryImage(
  id: string,
  input: UpdateGalleryImageInput
): Promise<GalleryImage> {
  return apiFetch<GalleryImage>(`/admin/gallery/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await apiFetch<void>(`/admin/gallery/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<UploadResponse>("/admin/upload", {
    method: "POST",
    auth: true,
    body: formData,
  });
}
