"use client";

import {
  formatGalleryGroup,
  GALLERY_MONTHS,
  getYearOptions,
  type GalleryDateValue,
} from "@/lib/gallery-date";

type GalleryDatePickerProps = {
  value: GalleryDateValue;
  onChange: (value: GalleryDateValue) => void;
  compact?: boolean;
  showPreview?: boolean;
};

export default function GalleryDatePicker({
  value,
  onChange,
  compact = false,
  showPreview = !compact,
}: GalleryDatePickerProps) {
  const years = getYearOptions();
  const groupLabel = formatGalleryGroup(value);

  function update(patch: Partial<GalleryDateValue>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className={`gallery-date-picker${compact ? " gallery-date-picker--compact" : ""}`}>
      <div className="gallery-date-picker__fields">
        <label className="gallery-date-picker__field">
          <span className="gallery-date-picker__label mono">Month</span>
          <select
            value={value.monthIndex}
            onChange={(event) =>
              update({ monthIndex: Number(event.target.value) })
            }
          >
            {GALLERY_MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label className="gallery-date-picker__field">
          <span className="gallery-date-picker__label mono">Year</span>
          <select
            value={value.year}
            onChange={(event) => update({ year: Number(event.target.value) })}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className="gallery-date-picker__field gallery-date-picker__field--day">
          <span className="gallery-date-picker__label mono">Day</span>
          <input
            type="number"
            min={1}
            max={31}
            placeholder="Optional"
            value={value.day ?? ""}
            disabled={value.day === null}
            onChange={(event) => {
              const next = event.target.value;
              update({ day: next ? Number(next) : null });
            }}
          />
        </label>
      </div>

      <label className="gallery-date-picker__toggle">
        <input
          type="checkbox"
          checked={value.day !== null}
          onChange={(event) =>
            update({ day: event.target.checked ? 1 : null })
          }
        />
        <span>Include specific day</span>
      </label>

      {showPreview ? (
        <p className="gallery-date-picker__preview mono">
          Group label: <strong>{groupLabel}</strong>
        </p>
      ) : null}
    </div>
  );
}
