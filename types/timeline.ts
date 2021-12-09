import {definitions} from "./supabase"

export type TimelineItem = definitions['things'] & { visible: boolean }

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