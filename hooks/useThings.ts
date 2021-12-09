import {useEffect, useState} from "react";
import {definitions} from "../types/supabase";
import { ThingType } from "../types/things";
import {TimelineData} from "../types/timeline";
import transformForTimeline from "../utils/transformForTimeline";

export function useThings(
    type: ThingType,
    options = { limit: 25, pollIntervalMs: 2 * 60 * 1000 }
) {
    const [timelineThings, setTimelineThings] = useState<TimelineData | null>(null)
    const [queued, setQueued] = useState<definitions['things'][]>([])
    const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const pollThings = async () => {
            const response = await fetch(`/api/things/${type}?limit=${options.limit}`)
            const things = await response.json() as definitions['things'][]

            const visibleCount = Object.keys(visibleIds).length
            if (!visibleCount) {
                setVisibleIds(things.reduce((acc, t) => {
                    if (t.id) {
                        acc[t.id] = true
                    }
                    return acc
                }, {} as Record<string, boolean>))
                setTimelineThings(transformForTimeline(things))
            } else if (visibleCount < options.limit) {
                setQueued(things.filter(t => t.id && visibleIds[t.id]))
            } else {
                setQueued(things.filter(t => t.id && visibleIds[t.id]))
            }
        };

        (async () => {
            await pollThings()
        })()
        const interval = setInterval(async () => await pollThings(), options.pollIntervalMs)

        return () => {
            clearInterval(interval)
            setVisibleIds({})
            setQueued([])
            setTimelineThings(null)
        };
    }, [])

    return {
        queued,
        timelineThings
    };
}