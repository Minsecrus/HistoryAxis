export type TimedTopic = {
  label: string
  year: number
}

export type EraLevel = 'north' | 'south' | 'central' | 'frontier'

export type Era = {
  id: string
  label: string
  start: number
  end: number
  track: number
  labelOffset?: number
  level: EraLevel
  note: string
  institutionalTopics: string[]
  eventTopics: TimedTopic[]
}
