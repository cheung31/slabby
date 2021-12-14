import {useCallback, useEffect, useMemo, useState} from "react";
import {definitions} from "../types/supabase";
import { ThingType } from "../types/things";
import {isQueuedItem, isVisibleItem, VisibleItem, AppearingItem, TimelineData, TimelineItem} from "../types/timeline";
import transformForTimeline from "../utils/transformForTimeline";

export type useThingsOptions = {
    limit: number,
    pollIntervalMs: number
}
export function useThings(
    type: ThingType,
    options: useThingsOptions = { limit: 25, pollIntervalMs: 2 * 60 * 1000 }
) {
    const [isFocused, setIsFocused] = useState<boolean>(true)
    const [pollIntervalId, setPollIntervalId] = useState<number | null>(null)
    const [fetched, setFetched] = useState<definitions['things'][]>([])
    const [timelineThings, setTimelineThings] = useState<TimelineItem[]>([])
    const [timelineData, setTimelineData] = useState<TimelineData | null>(null)

    const queuedSize = useMemo(() => {
        let numQueued = 0
        for (let i = 0; i < timelineThings.length; i++) {
            if (isQueuedItem(timelineThings[i])) numQueued++
        }
        // console.log("######", { numQueued })
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
        setTimelineData(transform(things))
    }, [queuedSize, timelineThings])

    const onDequeueEnd = useCallback((item: AppearingItem) => {
        const idx = timelineThings.findIndex(i => i.id === item.id)
        const visible: VisibleItem = {
            ...timelineThings[idx],
            visible: true,
            queued: false
        }
        timelineThings[idx] = visible
        const updatedItems = [...timelineThings]
        setTimelineThings(updatedItems)
        setTimelineData(transform(updatedItems))
    }, [timelineThings])

    const transform = useCallback((timelineItems: TimelineItem[]) => {
        return transformForTimeline(timelineItems, options.limit)
    }, [transformForTimeline, options.limit])

    const enqueueFetched = useCallback((fetched: definitions['things'][]): TimelineItem[] => {
        const visible = timelineThings.filter(i => isVisibleItem(i))
        const itemsLookup = timelineThings.reduce((acc, i) => {
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
            if (id && itemsLookup[id]) continue
            enqueued.unshift({ ...fetched[i], visible: false, queued: true })
        }
        return enqueued
    }, [timelineThings])

    useEffect(() => {
        if (pollIntervalId) {
            window.clearInterval(pollIntervalId)
        }
        setTimelineThings([])
        setTimelineData([])
    }, [type])

    useEffect(() => {
        const timelineItems = enqueueFetched(fetched)
        setTimelineThings(timelineItems)
        setTimelineData(transform(timelineItems))
    }, [fetched])

    const handleVisibilityChange = useCallback(() => {
        setIsFocused(!document.hidden)
    }, [])

    useEffect(() => {
        window.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [handleVisibilityChange])

    useEffect(() => {
        const pollThings = async () => {
            const response = await fetch(`/api/things/${type}?limit=${options.limit}`)
            const things = await response.json() as definitions['things'][]
            setFetched(things)
        };

        if (isFocused && !pollIntervalId) {
            (async () => {
                await pollThings()
            })()
            const interval = window.setInterval(async () => await pollThings(), options.pollIntervalMs)
            setPollIntervalId(interval)
        } else if (!isFocused && pollIntervalId) {
            window.clearInterval(pollIntervalId)
        }

        return () => {
            if (pollIntervalId) {
                window.clearInterval(pollIntervalId)
                setPollIntervalId(null)
            }
            setFetched([])
        };
    }, [isFocused, pollIntervalId, type, options.limit])

    return {
        timelineData,
        queuedSize,
        dequeue,
        onDequeueEnd
    };
}