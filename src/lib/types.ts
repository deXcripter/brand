export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string;
  content: string;
  body?: string[];
  published: boolean;
}

export interface GalleryImage {
  id: string;
  month: string;
  src: string;
  full: string;
  alt: string;
  caption: string;
  wide?: boolean;
  tall?: boolean;
}

export interface GalleryGroup {
  month: string;
  images: GalleryImage[];
}

export interface AuthLoginResponse {
  success: boolean;
}

export interface UploadResponse {
  url: string;
  src: string;
  full: string;
}

export interface ApiError {
  error: string;
}

export type CreateBlogPostInput = {
  title: string;
  subtitle: string;
  content: string;
  slug?: string;
  date?: string;
  tags?: string;
  published?: boolean;
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  newSlug?: string;
};

export type CreateGalleryImageInput = {
  src: string;
  full?: string;
  alt: string;
  caption: string;
  month: string;
  wide?: boolean;
  tall?: boolean;
};

export type UpdateGalleryImageInput = Partial<
  Pick<GalleryImage, "alt" | "caption" | "month" | "wide" | "tall">
>;
