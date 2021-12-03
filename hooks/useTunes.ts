import {useEffect, useState} from "react";
import {definitions} from "../types/supabase";
import {TimelineData} from "../types/timeline";
import transformForTimeline from "../utils/transformForTimeline";

export function useTunes(options = { pollIntervalMs: 2 * 60 * 1000 }) {
    const [tunes, setTunes] = useState<definitions['things'][]>([])
    const [timelineTunes, setTimelineTunes] = useState<TimelineData | null>(null);

    useEffect(() => {
        const pollTunes = async () => {
            const response = await fetch('/api/things/tune')
            const tunes = await response.json() as definitions['things'][]
            setTunes(tunes);
            setTimelineTunes(transformForTimeline(tunes));
        };

        (async () => {
            await pollTunes()
        })()
        const interval = setInterval(async () => await pollTunes(), options.pollIntervalMs)

        return () => {
            clearInterval(interval);
        };
    }, [])

    return {
        tunes,
        timelineTunes
    };
}