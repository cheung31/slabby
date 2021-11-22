import {useEffect, useState} from "react";
import {definitions} from "../types/supabase";

export function useTunes(options = { pollIntervalMs: 2 * 60 * 1000 }) {
    const [tunes, setTunes] = useState<definitions['things'][]>([])

    useEffect(() => {
        const pollTunes = async () => {
            const response = await fetch('/api/things/tune')
            const tunes = await response.json() as definitions['things'][]
            setTunes(tunes);
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
        tunes
    };
}