export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

export type SpanStatus = "beginning" | "end";

export interface TimelineEvent {
  year: string;
  month: Month;
  title: string;
  at?: string;
  /** HTML string — use `<p>` for paragraphs, `<a href="...">` for links */
  description: string;
  /** Shared id to link related milestones (e.g. start + end of university). */
  group?: string;
  /** Use with `group` — marks whether this entry opens or closes the span. */
  status?: SpanStatus;
}

export const MONTH_INDEX: Record<Month, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export interface IndexedTimelineEvent {
  event: TimelineEvent;
  index: number;
}

export interface SpacedTimelineEvent extends IndexedTimelineEvent {
  marginTopPx: number;
}

export interface ChronicleYearGroup {
  year: string;
  entries: SpacedTimelineEvent[];
  /** Extra space above this year block for calendar years with no events */
  gapBeforePx: number;
}

/** Vertical gap per month between events in the same year. */
const MONTH_GAP_PX = 20;
const BASE_YEAR_GAP_PX = 8;
const IDLE_YEAR_GAP_PX = 72;

export function getIdleYearsBetween(
  newerYear: number,
  olderYear: number
): number {
  return Math.max(0, newerYear - olderYear - 1);
}

function computeGapBeforePx(newerYear: number, olderYear: number): number {
  const idleYears = getIdleYearsBetween(newerYear, olderYear);
  return BASE_YEAR_GAP_PX + idleYears * IDLE_YEAR_GAP_PX;
}

export function eventTimestamp(event: TimelineEvent): number {
  return Number(event.year) * 12 + MONTH_INDEX[event.month];
}

function layoutYearEntries(
  entries: IndexedTimelineEvent[]
): SpacedTimelineEvent[] {
  const descending = [...entries].sort(
    (a, b) => MONTH_INDEX[b.event.month] - MONTH_INDEX[a.event.month]
  );

  return descending.map((entry, i) => {
    if (i === 0) {
      return { ...entry, marginTopPx: 0 };
    }

    const previous = descending[i - 1];
    const monthGap =
      MONTH_INDEX[previous.event.month] - MONTH_INDEX[entry.event.month];

    return {
      ...entry,
      marginTopPx: Math.max(16, monthGap * MONTH_GAP_PX),
    };
  });
}

export function buildChronicleTimeline(
  events: TimelineEvent[]
): ChronicleYearGroup[] {
  const indexed = events.map((event, index) => ({ event, index }));

  const grouped: Record<string, IndexedTimelineEvent[]> = {};
  for (const entry of indexed) {
    const { year } = entry.event;
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  }

  const sortedYears = Object.keys(grouped).sort(
    (a, b) => Number(b) - Number(a)
  );

  return sortedYears.map((year, index) => ({
    year,
    entries: layoutYearEntries(grouped[year]),
    gapBeforePx:
      index === 0
        ? 0
        : computeGapBeforePx(
            Number(sortedYears[index - 1]),
            Number(year)
          ),
  }));
}

export function formatMonthYear(month: Month, year: string): string {
  return `${month} ${year}`;
}

function isLatestEvent(
  event: TimelineEvent,
  allEvents: TimelineEvent[]
): boolean {
  const ts = eventTimestamp(event);
  return allEvents.every((other) => eventTimestamp(other) <= ts);
}

export function getHoverRange(
  event: TimelineEvent,
  allEvents: TimelineEvent[]
): string {
  if (event.group) {
    const siblings = allEvents.filter((e) => e.group === event.group);
    const beginning =
      siblings.find((e) => e.status === "beginning") ??
      siblings.reduce((earliest, current) =>
        eventTimestamp(current) < eventTimestamp(earliest) ? current : earliest
      );
    const end =
      siblings.find((e) => e.status === "end") ??
      siblings.reduce((latest, current) =>
        eventTimestamp(current) > eventTimestamp(latest) ? current : latest
      );

    const start = formatMonthYear(beginning.month, beginning.year);

    if (event.status === "beginning") {
      return start;
    }

    if (event.status === "end") {
      return `${start} — ${formatMonthYear(end.month, end.year)}`;
    }

    if (eventTimestamp(end) > eventTimestamp(beginning)) {
      return `${start} — ${formatMonthYear(end.month, end.year)}`;
    }

    return start;
  }

  const point = formatMonthYear(event.month, event.year);
  if (isLatestEvent(event, allEvents)) {
    return `${point} — Present`;
  }
  return point;
}
