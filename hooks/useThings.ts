import {useCallback, useEffect, useMemo, useState} from "react";
import {definitions} from "../types/supabase";
import { ThingType } from "../types/things";
import {TimelineData, TimelineItem} from "../types/timeline";
import transformForTimeline from "../utils/transformForTimeline";

export function useThings(
    type: ThingType,
    options = { limit: 25, pollIntervalMs: 2 * 60 * 1000 }
) {
    const [fetched, setFetched] = useState<definitions['things'][]>([])
    const [timelineThings, setTimelineThings] = useState<TimelineItem[]>([])
    const [timelineData, setTimelineData] = useState<TimelineData | null>(null)

    const queuedSize = useMemo(() => {
        let numQueued = 0
        for (let i = 0; i < timelineThings.length; i++) {
            if (timelineThings[i].visible) break
            numQueued++
        }
        return numQueued
    }, [timelineThings])

    const dequeue = useCallback(() => {
        if (!queuedSize) return

        const things = [...timelineThings]
        things[queuedSize - 1] = {
            ...things[queuedSize - 1],
            visible: true,
            queued: true
        }
        setTimelineThings(things)
        const { timelineData } = transform(things)
        setTimelineData(timelineData)
    }, [queuedSize])

    const transform = useCallback((timelineItems: TimelineItem[]) => {
        return transformForTimeline(timelineItems, options.limit)
    }, [transformForTimeline, options.limit])

    const enqueueFetched = useCallback((fetched: definitions['things'][]): TimelineItem[] => {
        const visible = timelineThings.filter(i => i.visible && !i.queued)
        const visibleLookup = visible.reduce((acc, i) => {
            if (i.id) acc[i.id] = true
            return acc
        }, {} as Record<string, boolean>)

        if (!visible.length) {
            return fetched.map((i, idx) => {
                // if (idx === 0) return { ...i, visible: false, queued: true }
                return { ...i, visible: true, queued: false }
            })
        }

        let enqueued = [...timelineThings]
        for (let i = fetched.length - 1; i >= 0; i--) {
            const id = fetched[i].id
            if (id && visibleLookup[id]) continue
            enqueued.unshift({ ...fetched[i], visible: false, queued: true })
        }
        return enqueued
    }, [timelineThings])

    useEffect(() => {
        const timelineItems = enqueueFetched(fetched)
        const { timelineData } = transform(timelineItems)

        setTimelineThings(timelineItems)
        setTimelineData(timelineData)
    }, [fetched])

    useEffect(() => {
        const pollThings = async () => {
            const response = await fetch(`/api/things/${type}?limit=${options.limit}`)
            const things = await response.json() as definitions['things'][]
            setFetched(things)
        };

        (async () => {
            await pollThings()
        })()
        const interval = setInterval(async () => await pollThings(), options.pollIntervalMs)

        return () => {
            clearInterval(interval)
            setFetched([])
            setTimelineThings([])
            setTimelineData(null)
        };
    }, [type, options.limit])

    return {
        timelineData,
        queuedSize,
        dequeue
    };
}