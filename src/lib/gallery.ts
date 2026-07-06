import { apiFetch, serverApiFetch } from "@/lib/api-client";
import type {
  CreateGalleryImageInput,
  GalleryGroup,
  GalleryImage,
  UpdateGalleryImageInput,
  UploadResponse,
} from "@/lib/types";

export type { GalleryImage, GalleryGroup } from "@/lib/types";

function groupImages(images: GalleryImage[]): GalleryGroup[] {
  const grouped = new Map<string, GalleryImage[]>();

  for (const image of images) {
    const bucket = grouped.get(image.month) ?? [];
    bucket.push(image);
    grouped.set(image.month, bucket);
  }

  return Array.from(grouped.entries()).map(([month, monthImages]) => ({
    month,
    images: monthImages,
  }));
}

export async function getGalleryGroups(): Promise<GalleryGroup[]> {
  const images = await serverApiFetch<GalleryImage[]>("/gallery");
  return groupImages(images);
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
