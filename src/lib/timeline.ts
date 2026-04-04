import type { EraLevel } from "../types/history";

export const startYear = -1700000;
export const endYear = 2026;
export const timelinePaddingLeft = 140;
export const timelinePaddingRight = 96;
export const yearMarks = [
  -1700000, -1000000, -500000, -100000, -10000, -8000, -6000, -4000, -3000,
  -2000, -1000, 0, 500, 1000, 1500, 1900, 1950, 2000, 2026,
] as const;

const timelineSegments = [
  { start: -1700000, end: -10000, pxPerYear: 0.0045 },
  { start: -10000, end: -300, pxPerYear: 1 },
  { start: -300, end: 1900, pxPerYear: 3 },
  { start: 1900, end: 2026, pxPerYear: 16 },
] as const;

export const getXByYear = (year: number) => {
  let x = timelinePaddingLeft;

  for (const segment of timelineSegments) {
    if (year <= segment.start) {
      break;
    }

    const segmentEnd = Math.min(year, segment.end);
    x += (segmentEnd - segment.start) * segment.pxPerYear;

    if (year <= segment.end) {
      break;
    }
  }

  return x;
};

export const getSpanWidth = (start: number, end: number) => {
  return getXByYear(end) - getXByYear(start);
};

export const timelineWidth = getXByYear(endYear) + timelinePaddingRight;

export const clampYear = (year: number) => {
  return Math.min(endYear, Math.max(startYear, year));
};

export const getNavigationStep = (year: number) => {
  if (year <= -100000) {
    return 50000;
  }
  if (year <= -60000) {
    return 20000;
  }
  if (year <= -30000) {
    return 10000;
  }

  if (year <= -10000) {
    return 5000;
  }

  if (year <= -800) {
    return 500;
  }

  if (year < 1900) {
    return 100;
  }

  return 10;
};

export const getNextNavigationYear = (
  year: number,
  direction: "left" | "right",
) => {
  const current = clampYear(year);

  if (direction === "left" && current === startYear) {
    return current;
  }

  if (direction === "right" && current === endYear) {
    return current;
  }

  const step = getNavigationStep(current);
  const delta = direction === "right" ? step : -step;

  return clampYear(current + delta);
};

export const toYearLabel = (year: number) => {
  if (year <= -10000) {
    const tenThousands = Math.abs(year) / 10000;
    const rounded =
      tenThousands >= 100
        ? Math.round(tenThousands)
        : Math.round(tenThousands * 10) / 10;
    return `${rounded}万年前`;
  }

  if (year < 0) {
    return `前${Math.abs(year)}`;
  }

  return `${year}`;
};

export const levelStyles: Record<
  EraLevel,
  { line: string; text: string; topic: string }
> = {
  north: {
    line: "bg-neutral-900",
    text: "text-neutral-950",
    topic: "text-neutral-500",
  },
  south: {
    line: "bg-neutral-700",
    text: "text-neutral-900",
    topic: "text-neutral-500",
  },
  central: {
    line: "bg-neutral-800",
    text: "text-neutral-950",
    topic: "text-neutral-500",
  },
  frontier: {
    line: "bg-neutral-500",
    text: "text-neutral-900",
    topic: "text-neutral-400",
  },
};
