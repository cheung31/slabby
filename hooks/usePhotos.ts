import {useEffect, useState} from "react";
import {definitions} from "../types/supabase";

export function usePhotos(options = { pollIntervalMs: 2 * 60 * 1000 }) {
    const [photos, setPhotos] = useState<definitions['things'][]>([])

    useEffect(() => {
        const pollPhotos = async () => {
            const response = await fetch('/api/things/photo')
            const photos = await response.json() as definitions['things'][]
            setPhotos(photos);
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
        photos
    };
}