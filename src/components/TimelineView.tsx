import type { RefObject } from 'react'
import type { Era } from '../types/history'
import {
  getSpanWidth,
  getXByYear,
  levelStyles,
  toYearLabel,
  yearMarks,
} from '../lib/timeline'

type TimelineViewProps = {
  eras: Era[]
  focusYear: number
  timelineWidth: number
  timelineYears: number[]
  timelineWindowRef: RefObject<HTMLDivElement | null>
  translateX: number
}

export function TimelineView({
  eras,
  focusYear,
  timelineWidth,
  timelineYears,
  timelineWindowRef,
  translateX,
}: TimelineViewProps) {
  return (
    <section
      className="relative grid min-h-screen place-items-center overflow-hidden px-0 pb-8 pt-24 md:pt-28"
      aria-label="中国历史时间轴"
    >
      <div
        ref={timelineWindowRef}
        className="relative h-[min(100svh-8rem,42rem)] w-screen overflow-hidden md:h-[min(100svh-9rem,44rem)]"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-16 bg-gradient-to-r from-white via-white/90 to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-16 bg-gradient-to-l from-white via-white/90 to-transparent md:w-28" />
        <div
          className="absolute inset-y-0 left-0 transition-transform duration-500 ease-out"
          style={{
            width: `${timelineWidth}px`,
            transform: `translateX(${translateX}px)`,
          }}
        >
          <div className="absolute inset-0" aria-hidden="true">
            {timelineYears.map((year) => {
              const position = getXByYear(year)
              return (
                <div
                  key={year}
                  className="absolute inset-y-0 w-px bg-neutral-200"
                  style={{ left: `${position}px` }}
                >
                  <span className="absolute left-1.5 top-3 text-[9px] tracking-[0.18em] text-neutral-300 [writing-mode:vertical-rl]">
                    {toYearLabel(year)}
                  </span>
                </div>
              )
            })}
          </div>

          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-neutral-900"
            aria-hidden="true"
          />

          {eras.map((era) => {
            const left = getXByYear(era.start)
            const width = getSpanWidth(era.start, era.end)
            const style = levelStyles[era.level]
            const defaultLabelOffset = era.track <= 0 ? 10 : 8
            const labelOffset = era.labelOffset ?? defaultLabelOffset

            return (
              <article
                key={era.id}
                className="absolute"
                style={{
                  left: `${left}px`,
                  width: `${Math.max(width, 36)}px`,
                  top: `calc(50% + ${era.track}px)`,
                }}
              >
                <div
                  className={`h-[3px] w-full ${style.line} transition-all duration-200 ${
                    focusYear >= era.start && focusYear <= era.end
                      ? 'opacity-100 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]'
                      : 'opacity-70'
                  }`}
                />
                <div
                  className="absolute left-0 flex flex-col gap-1"
                  style={{
                    top: `${labelOffset}px`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    {toYearLabel(era.start)} - {toYearLabel(era.end)}
                  </span>
                  <h2 className={`text-base leading-none tracking-[-0.04em] ${style.text}`}>
                    {era.label}
                  </h2>
                </div>
              </article>
            )
          })}

          {eras.map((era) => {
            const left = getXByYear(era.start)
            const width = getSpanWidth(era.start, era.end)
            const center = left + Math.max(width, 36) / 2

            return (
              <div key={`${era.id}-topics`}>
                {era.eventTopics.map((topic) => {
                  const topicLeft = getXByYear(topic.year)

                  return (
                    <aside
                      key={`${era.id}-${topic.label}`}
                      className="absolute -translate-x-1/2 text-center"
                      style={{
                        left: `${topicLeft}px`,
                        top: 'calc(50% - 248px)',
                        width: '96px',
                      }}
                    >
                      <p className="text-[10px] leading-4 text-neutral-500">{topic.label}</p>
                    </aside>
                  )
                })}

                {era.institutionalTopics.length > 0 ? (
                  <aside
                    className="absolute -translate-x-1/2 text-center"
                    style={{
                      left: `${center}px`,
                      top: 'calc(50% + 206px)',
                      width: `${Math.max(width + 36, 96)}px`,
                    }}
                  >
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-neutral-400">
                      {era.institutionalTopics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  </aside>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const createTimelineYears = () => {
  return [...yearMarks]
}
