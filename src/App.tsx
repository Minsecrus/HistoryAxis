import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Landmark } from "lucide-react";
import { TimelineView, createTimelineYears } from "./components/TimelineView";
import { eras } from "./data/timeline";
import {
  endYear,
  getNavigationStep,
  getXByYear,
  startYear,
  timelineWidth,
} from "./lib/timeline";

function App() {
  const [focusYear, setFocusYear] = useState(960);
  const [viewportWidth, setViewportWidth] = useState(0);
  const timelineWindowRef = useRef<HTMLDivElement | null>(null);

  const timelineYears = useMemo(() => createTimelineYears(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();

      setFocusYear((current) => {
        const step = getNavigationStep(current);
        const delta = event.key === "ArrowRight" ? step : -step;
        return Math.min(endYear, Math.max(startYear, current + delta));
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const element = timelineWindowRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setViewportWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const viewportCenter = getXByYear(focusYear);
  const translateX = Math.min(
    Math.max(viewportWidth / 2 - viewportCenter, viewportWidth - timelineWidth),
    0,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-950">
      <header className="absolute left-4 top-4 z-10 max-w-[calc(100vw-2rem)] rounded-3xl border border-neutral-200/80 bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur md:left-6 md:top-6 md:px-6 md:py-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-neutral-400">
          <Landmark className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>History Axis</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
          <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
          <p>高中历史 / 左右方向键移动</p>
        </div>
      </header>

      <TimelineView
        eras={eras}
        focusYear={focusYear}
        timelineWidth={timelineWidth}
        timelineYears={timelineYears}
        timelineWindowRef={timelineWindowRef}
        translateX={translateX}
      />
    </main>
  );
}

export default App;
