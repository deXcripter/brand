import { fetchGalleryBatch, type GalleryImage } from "@/lib/gallery";
import GalleryView from "@/components/gallery-view";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let images: GalleryImage[] = [];
  let hasMore = false;

  try {
    const batch = await fetchGalleryBatch();
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
          <h1 className="page-header__title">Captured along the way</h1>
          <p className="page-header__sub">
            A running, unfiltered timeline. Tap any photo to expand it.
          </p>
        </div>
      </section>

      <GalleryView initialImages={images} initialHasMore={hasMore} />
    </>
  );
}
