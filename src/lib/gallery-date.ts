export const GALLERY_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type GalleryDateValue = {
  monthIndex: number;
  year: number;
  day: number | null;
};

/** Convert a Date to a "Month YYYY" label (e.g. "June 2026"). */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/** Convert a GalleryDateValue to an ISO 8601 date string. */
export function galleryDateToISO({
  monthIndex,
  year,
  day,
}: GalleryDateValue): string {
  const d = day ?? 1;
  const month = String(monthIndex + 1).padStart(2, "0");
  const dayStr = String(d).padStart(2, "0");
  return `${year}-${month}-${dayStr}T00:00:00.000Z`;
}

export function formatGalleryGroup({
  monthIndex,
  year,
  day,
}: GalleryDateValue): string {
  const monthName = GALLERY_MONTHS[monthIndex] ?? GALLERY_MONTHS[0];

  if (day !== null && day >= 1 && day <= 31) {
    return `${monthName} ${day}, ${year}`;
  }

  return `${monthName} ${year}`;
}

export function parseGalleryGroup(label: string): GalleryDateValue {
  const withDay = label.match(/^(\w+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (withDay) {
    const monthIndex = GALLERY_MONTHS.indexOf(
      withDay[1] as (typeof GALLERY_MONTHS)[number]
    );
    return {
      monthIndex: monthIndex >= 0 ? monthIndex : new Date().getMonth(),
      year: Number(withDay[3]),
      day: Number(withDay[2]),
    };
  }

  const monthYear = label.match(/^(\w+)\s+(\d{4})$/);
  if (monthYear) {
    const monthIndex = GALLERY_MONTHS.indexOf(
      monthYear[1] as (typeof GALLERY_MONTHS)[number]
    );
    return {
      monthIndex: monthIndex >= 0 ? monthIndex : new Date().getMonth(),
      year: Number(monthYear[2]),
      day: null,
    };
  }

  const now = new Date();
  return {
    monthIndex: now.getMonth(),
    year: now.getFullYear(),
    day: null,
  };
}

export function getDefaultGalleryDate(): GalleryDateValue {
  const now = new Date();
  return {
    monthIndex: now.getMonth(),
    year: now.getFullYear(),
    day: null,
  };
}

export function getYearOptions(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, index) => current - 5 + index);
}
