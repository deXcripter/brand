import { getGalleryGroups } from "@/lib/gallery";
import GalleryView from "@/components/gallery-view";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const groups = await getGalleryGroups();

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

      <GalleryView groups={groups} />
    </>
  );
}
