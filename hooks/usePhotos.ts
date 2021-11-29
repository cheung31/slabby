import {useEffect, useState} from "react";
import {definitions} from "../types/supabase";
import {TimelineData} from "../types/timeline";

function transformForTimeline(things: definitions['things'][]) {
    return things.reduce((acc, t) => {
        if (!t.content_date) return acc

        const d = new Date(t.content_date)
        const thingYear = d.getFullYear()
        const thingMonth = d.getMonth() + 1

        const yearIndex = acc.map((y) => y.year).indexOf(thingYear)
        if (yearIndex < 0) {
            acc.push({
                year: thingYear,
                months: [{
                    year: thingYear,
                    month: thingMonth,
                    items: [t]
                }]
            })
        } else {
            const monthIndex = acc[yearIndex].months.map((m) => m.month).indexOf(thingMonth)
            if (monthIndex < 0) {
                acc[yearIndex].months.push({
                    year: thingYear,
                    month: thingMonth,
                    items: [t]
                })
            } else {
                acc[yearIndex].months[monthIndex].items.push(t)
            }
        }

        return acc
    }, [] as TimelineData);
}

export function usePhotos(options = { pollIntervalMs: 2 * 60 * 1000 }) {
    const [photos, setPhotos] = useState<definitions['things'][]>([])
    const [timelinePhotos, setTimelinePhotos] = useState<TimelineData | null>(null);

    useEffect(() => {
        const pollPhotos = async () => {
            const response = await fetch('/api/things/photo')
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