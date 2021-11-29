import {definitions} from "./supabase";

export type TimelineMonth = {
    year: number,
    month: number,
    items: definitions['things'][]
}

export type TimelineYear = {
    year: number,
    months: TimelineMonth[]
}

export type TimelineData = TimelineYear[]