import GalleryManager from "@/components/dashboard/gallery-manager";

export default function DashboardGalleryPage() {
  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow mono">// gallery</p>
          <h1 className="dashboard-header__title">Gallery images</h1>
        </div>
      </header>
      <GalleryManager />
    </>
  );
}
