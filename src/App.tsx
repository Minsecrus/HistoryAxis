import { useEffect, useMemo, useRef, useState } from "react";
import { Info, X } from "lucide-react";
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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const timelineWindowRef = useRef<HTMLDivElement | null>(null);

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
      <header className="absolute left-4 top-4 z-10 max-w-[calc(100vw-7rem)] rounded-3xl border border-neutral-200/80 bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur md:left-6 md:top-6 md:px-6 md:py-5">
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
        className="absolute right-4 top-4 z-10 flex h-14 w-14 items-center justify-center rounded-3xl border border-neutral-200/80 bg-white/95 text-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur transition hover:border-neutral-300 hover:text-neutral-950 md:right-6 md:top-6"
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
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
                  Project Info
                </p>
                <h2
                  id="info-modal-title"
                  className="mt-2 text-2xl font-semibold tracking-[0.04em] text-neutral-950"
                >
                  HistoryAxis
                </h2>
              </div>
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
                HistoryAxis 是一个基于 React + TypeScript
                构建的中国历史时间轴项目，
                用一条可横向浏览的主轴串联主要时代、事件与制度脉络，适合课堂演示、
                复习梳理与快速定位历史阶段。
              </p>
              <p>
                当前交互支持键盘左右方向键移动焦点年份，界面强调单屏连续浏览，帮助用户以更直观的方式理解不同历史时期之间的前后关系。
              </p>
              <p>
                By <strong>Minsecrus</strong>.
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
