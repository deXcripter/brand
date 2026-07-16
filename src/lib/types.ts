export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string;
  content: string;
  body?: string[];
  published: boolean;
  category: "personal" | "search-ai";
  /** Custom meta description from the backend. Falls back to auto-generated excerpt. */
  metaDescription?: string;
}

export interface GalleryImage {
  id: string;
  date: string;
  src: string;
  full: string;
  alt: string;
  caption: string;
  wide?: boolean;
  tall?: boolean;
  category?: "personal" | "random" | "events";
}

export interface GalleryGroup {
  month: string;
  images: GalleryImage[];
}

export interface PaginatedGalleryResponse {
  images: GalleryImage[];
  hasMore: boolean;
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
  category?: string;
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  newSlug?: string;
};

export type CreateGalleryImageInput = {
  src: string;
  full?: string;
  alt: string;
  caption: string;
  date: string;
  wide?: boolean;
  tall?: boolean;
  category?: string;
};

export type UpdateGalleryImageInput = Partial<
  Pick<GalleryImage, "alt" | "caption" | "date" | "wide" | "tall" | "category">
>;
