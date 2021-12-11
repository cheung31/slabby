import {definitions} from "./supabase"

type QueuedItem = definitions['things'] & { visible: false, queued: true }
type AppearingItem = definitions['things'] & { visible: true, queued: true }
type VisibleItem = definitions['things'] & { visible: true, queued: false }

export type TimelineItem = QueuedItem | AppearingItem | VisibleItem

export type TimelineMonth = {
    year: number,
    month: number,
    items: TimelineItem[]
}

export type TimelineYear = {
    year: number,
    months: TimelineMonth[]
}

export type TimelineData = TimelineYear[]