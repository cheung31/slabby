import {useEffect, useState} from "react";
import {definitions} from "../types/supabase";
import {TimelineData} from "../types/timeline";
import transformForTimeline from "../utils/transformForTimeline";

export function usePhotos(options = { pollIntervalMs: 2 * 60 * 1000 }) {
    const [photos, setPhotos] = useState<definitions['things'][]>([])
    const [timelinePhotos, setTimelinePhotos] = useState<TimelineData | null>(null);
    const size = 25

    useEffect(() => {
        const pollPhotos = async () => {
            const response = await fetch(`/api/things/photo?limit=${size}`)
            const photos = await response.json() as definitions['things'][]
            setPhotos(photos);
            setTimelinePhotos(transformForTimeline(photos));
        };

        (async () => {
            await pollPhotos()
        })()
        const interval = setInterval(async () => await pollPhotos(), options.pollIntervalMs)

        return () => {
            clearInterval(interval);
        };
    }, [])

    return {
        photos,
        timelinePhotos
    };
}