import { useEffect, useMemo, useRef, useState } from "react";
import { Info, X } from "lucide-react";
import { TimelineView, createTimelineYears } from "./components/TimelineView";
import { eras } from "./data/timeline";
import {
  clampYear,
  getNextNavigationYear,
  getXByYear,
  getYearByX,
  timelineWidth,
} from "./lib/timeline";

function App() {
  const [focusYear, setFocusYear] = useState(() => clampYear(960));
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const timelineWindowRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startTimelineX: number;
  } | null>(null);

  const timelineYears = useMemo(() => createTimelineYears(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsInfoOpen(false);
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();

      setFocusYear((current) => {
        return getNextNavigationYear(
          current,
          event.key === "ArrowRight" ? "right" : "left",
        );
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

  const viewportCenter = getXByYear(clampYear(focusYear));
  const translateX = Math.min(
    Math.max(viewportWidth / 2 - viewportCenter, viewportWidth - timelineWidth),
    0,
  );

  const endTimelineDrag = (pointerId: number) => {
    if (dragStateRef.current?.pointerId !== pointerId) {
      return;
    }

    dragStateRef.current = null;
    setIsDraggingTimeline(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-950">
      <header className="absolute left-5 top-5 z-10 md:left-8 md:top-7">
        <p className="text-lg font-semibold tracking-[0.16em] uppercase md:text-xl">
          <span className="text-neutral-500">History</span>
          <span className="text-neutral-900">Axis</span>
        </p>
      </header>

      <button
        type="button"
        aria-label="Open project info"
        aria-haspopup="dialog"
        aria-expanded={isInfoOpen}
        onClick={() => setIsInfoOpen(true)}
        className="absolute right-5 top-5 z-10 text-neutral-500 transition hover:text-neutral-950 md:right-8 md:top-8"
      >
        <Info className="h-5 w-5" strokeWidth={1.9} />
      </button>

      <TimelineView
        eras={eras}
        focusYear={focusYear}
        timelineWidth={timelineWidth}
        timelineYears={timelineYears}
        timelineWindowRef={timelineWindowRef}
        translateX={translateX}
        isDragging={isDraggingTimeline}
        onPointerDown={(event) => {
          if (!event.isPrimary) {
            return;
          }

          dragStateRef.current = {
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startTimelineX: getXByYear(clampYear(focusYear)),
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDraggingTimeline(true);
        }}
        onPointerMove={(event) => {
          const dragState = dragStateRef.current;

          if (!dragState || dragState.pointerId !== event.pointerId) {
            return;
          }

          const deltaX = event.clientX - dragState.startClientX;
          setFocusYear(getYearByX(dragState.startTimelineX - deltaX));
          event.preventDefault();
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          endTimelineDrag(event.pointerId);
        }}
        onPointerCancel={(event) => {
          endTimelineDrag(event.pointerId);
        }}
        onLostPointerCapture={(event) => {
          endTimelineDrag(event.pointerId);
        }}
      />

      {isInfoOpen ? (
        <div
          className="absolute inset-0 z-20 flex items-start justify-center bg-neutral-950/24 px-4 py-20 backdrop-blur-sm md:px-6 md:py-24"
          role="presentation"
          onClick={() => setIsInfoOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            className="w-full max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.16)] md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="info-modal-title"
                className="text-2xl font-semibold tracking-[0.04em] text-neutral-950"
              >
                HistoryAxis
              </h2>
              <button
                type="button"
                aria-label="Close project info"
                onClick={() => setIsInfoOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                <X className="h-4.5 w-4.5" strokeWidth={1.9} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-600">
              <p>
                一条从元谋人到今天的中国历史时间轴。轴线上是各个时代，上方标注重要事件，下方是同时期的制度、技术与文化特征。
              </p>
              <p>
                时间刻度并不均匀：远古部分被压缩，越接近现代，每一年占的宽度越大。
              </p>
              <p>拖动画面，或按左右方向键浏览。</p>
              <p>
                By{" "}
                <a
                  href="https://github.com/Minsecrus"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition hover:decoration-neutral-900"
                >
                  Minsecrus
                </a>
                .
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-neutral-200 pt-5 text-sm text-neutral-600">
              <a
                href="https://github.com/Minsecrus/HistoryAxis"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center rounded-full border border-neutral-300 px-4 py-2 text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
              >
                GitHub 仓库
              </a>
              <p>技术栈：React 19 / TypeScript / Vite / Tailwind CSS 4</p>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default App;
