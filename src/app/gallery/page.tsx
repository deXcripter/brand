import type { Metadata } from "next";
import { fetchGalleryBatch, type GalleryImage } from "@/lib/gallery";
import GalleryView from "@/components/gallery-view";

/** ISR: revalidate every 60 seconds so new photos appear without a full redeploy. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Gallery | Johnpaul Nnaji",
  },
  description:
    "Photos from work and life. Tap any image to open it.",
  openGraph: {
    title: "Gallery | Johnpaul Nnaji",
    description: "Photos from work and life. Tap any image to open it.",
    type: "website",
  },
};

export default async function GalleryPage() {
  let images: GalleryImage[] = [];
  let hasMore = false;

  try {
    const batch = await fetchGalleryBatch(undefined, undefined, "events");
    images = batch.images;
    hasMore = batch.hasMore;
  } catch {
    // API unreachable — render empty gallery
  }

  return (
    <>
      <section className="page-header">
        <div className="section__inner">
          <p className="eyebrow mono">// gallery</p>
          <h1 className="page-header__title">Gallery</h1>
          <p className="page-header__sub">
            Photos I&apos;ve taken. Tap any one to open it.
          </p>
        </div>
      </section>

      <GalleryView initialImages={images} initialHasMore={hasMore} />
    </>
  );
}
