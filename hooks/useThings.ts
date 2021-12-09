import {useCallback, useEffect, useState} from "react";
import {definitions} from "../types/supabase";
import { ThingType } from "../types/things";
import {TimelineData} from "../types/timeline";
import transformForTimeline from "../utils/transformForTimeline";

export function useThings(
    type: ThingType,
    options = { limit: 25, pollIntervalMs: 2 * 60 * 1000 }
) {
    const [fetched, setFetched] = useState<definitions['things'][]>([])
    const [timelineThings, setTimelineThings] = useState<TimelineData | null>(null)

    const transform = useCallback((fetched) => {
        return transformForTimeline(timelineThings, fetched, options.limit)
    }, [transformForTimeline, timelineThings, options.limit])

    useEffect(() => {
        const {
            timelineData
        } = transform(fetched)
        setTimelineThings(timelineData)
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
            setTimelineThings(null)
        };
    }, [])

    return {
        timelineThings
    };
}