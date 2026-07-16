"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  createGalleryImage,
  deleteGalleryImage,
  getAdminGalleryImages,
  updateGalleryImage,
  uploadImage,
} from "@/lib/gallery";
import {
  formatGalleryGroup,
  formatMonthLabel,
  galleryDateToISO,
  getDefaultGalleryDate,
  parseGalleryGroup,
  type GalleryDateValue,
} from "@/lib/gallery-date";
import GalleryDatePicker from "@/components/dashboard/gallery-date-picker";

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadDate, setUploadDate] = useState<GalleryDateValue>(
    getDefaultGalleryDate
  );
  const [uploadCategory, setUploadCategory] = useState<string>("events");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAdminGalleryImages()
      .then(setImages)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load gallery")
      )
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, GalleryImage[]>();
    for (const image of images) {
      const label = formatMonthLabel(new Date(image.date));
      const bucket = map.get(label) ?? [];
      bucket.push(image);
      map.set(label, bucket);
    }
    return Array.from(map.entries());
  }, [images]);

  const uploadGroup = formatGalleryGroup(uploadDate);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(fileList)) {
        const { url } = await uploadImage(file);
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        const image = await createGalleryImage({
          src: url,
          full: url,
          alt,
          caption: alt,
          date: galleryDateToISO(uploadDate),
          category: uploadCategory,
        });
        setImages((current) => [image, ...current]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function saveImage(id: string, patch: Partial<GalleryImage>) {
    try {
      const updated = await updateGalleryImage(id, patch);
      setImages((current) =>
        current.map((image) => (image.id === id ? updated : image))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    }
  }

  async function removeImage(id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id);
      setImages((current) => current.filter((image) => image.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void uploadFiles(event.dataTransfer.files);
  }

  if (loading) {
    return <p className="dashboard-muted">Loading gallery…</p>;
  }

  return (
    <div className="dashboard-gallery">
      <section className="dashboard-panel gallery-upload">
        <div className="gallery-upload__header">
          <div>
            <h2 className="dashboard-panel__title">Upload images</h2>
            <p className="gallery-upload__subtitle">
              Choose when the photos belong, then drop files or browse.
            </p>
          </div>
          <span className="gallery-upload__badge mono">{uploadGroup}</span>
        </div>

        <GalleryDatePicker value={uploadDate} onChange={setUploadDate} />

        <div className="gallery-upload__category" style={{ margin: "var(--space-2) 0 var(--space-3)" }}>
          <label className="dashboard-field">
            <span className="dashboard-field__label mono">Category</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              <option value="events">Events</option>
              <option value="random">Random</option>
              <option value="personal">Personal</option>
            </select>
          </label>
        </div>

        <div
          className={`gallery-upload__dropzone${dragging ? " is-dragging" : ""}${uploading ? " is-uploading" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload gallery images"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(event) => uploadFiles(event.target.files)}
          />
          <div className="gallery-upload__icon" aria-hidden="true">
            ↑
          </div>
          <p className="gallery-upload__title">
            {uploading ? "Uploading images…" : "Drop images here"}
          </p>
          <p className="gallery-upload__hint">
            or click to browse · JPEG, PNG, WebP, GIF · up to 8 MB each
          </p>
        </div>

        {error ? <p className="dashboard-form__error">{error}</p> : null}
      </section>

      {grouped.length === 0 ? (
        <p className="dashboard-muted">No images yet.</p>
      ) : null}

      {grouped.map(([groupMonth, groupImages]) => (
        <section className="dashboard-panel" key={groupMonth}>
          <h2 className="dashboard-panel__title mono">{groupMonth}</h2>
          <div className="dashboard-gallery__grid">
            {groupImages.map((image) => (
              <GalleryImageCard
                key={image.id}
                image={image}
                onSave={saveImage}
                onDelete={removeImage}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GalleryImageCard({
  image,
  onSave,
  onDelete,
}: {
  image: GalleryImage;
  onSave: (id: string, patch: Partial<GalleryImage>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [date, setDate] = useState<GalleryDateValue>(() =>
    parseGalleryGroup(formatMonthLabel(new Date(image.date)))
  );

  useEffect(() => {
    setDate(parseGalleryGroup(formatMonthLabel(new Date(image.date))));
  }, [image.date]);

  function handleDateChange(next: GalleryDateValue) {
    setDate(next);
    void onSave(image.id, { date: galleryDateToISO(next) });
  }

  return (
    <article className="dashboard-gallery__card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolveMediaUrl(image.src)} alt={image.alt} />
      <div className="dashboard-gallery__fields">
        <label className="dashboard-gallery__field">
          <span className="mono">Alt text</span>
          <input
            defaultValue={image.alt}
            onBlur={(event) => onSave(image.id, { alt: event.target.value })}
          />
        </label>
        <label className="dashboard-gallery__field">
          <span className="mono">Caption</span>
          <input
            defaultValue={image.caption}
            onBlur={(event) =>
              onSave(image.id, { caption: event.target.value })
            }
          />
        </label>
        <label className="dashboard-gallery__field">
          <span className="mono">Category</span>
          <select
            value={image.category ?? "personal"}
            onChange={(event) =>
              void onSave(image.id, { category: event.target.value as any })
            }
          >
            <option value="events">Events</option>
            <option value="random">Random</option>
            <option value="personal">Personal</option>
          </select>
        </label>

        <GalleryDatePicker
          compact
          showPreview={false}
          value={date}
          onChange={handleDateChange}
        />

        <div className="dashboard-gallery__toggles">
          <label>
            <input
              type="checkbox"
              checked={Boolean(image.wide)}
              onChange={(event) =>
                onSave(image.id, { wide: event.target.checked })
              }
            />
            Wide
          </label>
          <label>
            <input
              type="checkbox"
              checked={Boolean(image.tall)}
              onChange={(event) =>
                onSave(image.id, { tall: event.target.checked })
              }
            />
            Tall
          </label>
        </div>
        <button
          type="button"
          className="dashboard-gallery__delete"
          onClick={() => onDelete(image.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
