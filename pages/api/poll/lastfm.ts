// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from "@supabase/supabase-js";
import LastFm from '@toplast/lastfm'
import { supabase } from '../../../utils/supabaseClient'
import { definitions } from "../../../types/supabase";

type Error = {
    error: string
}
type Data = definitions['things'][] | null | PostgrestError | Error

function padDigits(number: number, digits: number) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number
}

type PostQuery = {
    user?: string
}

async function post(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (!process.env.LASTFM_API_KEY) {
        return res.status(500).json({ error: 'Missing LastFM API Key' })
    }

    const lastFm = new LastFm(process.env.LASTFM_API_KEY)
    const query = req.query as PostQuery
    const user = query.user || 'cheung31'

    const recentTracks = await lastFm.user.getRecentTracks({ user })
    const records = recentTracks.recenttracks.track
        .map<definitions['things']>((track) => {
            let timestampz
            if (track.date) {
                const d = new Date(parseInt(track.date?.uts) * 1000)
                timestampz = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}T${padDigits(d.getUTCHours(), 2)}:${padDigits(d.getUTCMinutes(), 2)}:${padDigits(d.getUTCSeconds(), 2)}.000Z`
            }
            const image_url = track.image[3]["#text"].replace('300x300','_')

            return {
                type: "tune",
                external_id: `${track.mbid || track.name}::${track.date?.uts}`,
                external_url: track.url,
                title: track.name,
                description: track.artist["#text"],
                image_url,
                content_date: timestampz, // "2021-11-21T07:13:48.000Z"
                external_source: "Last.fm"
            }
        })

    const { data, error } = await supabase
        .from<definitions['things']>('things')
        .upsert(records, { onConflict: 'external_source,external_id', ignoreDuplicates: true })

    if (error) {
        console.warn("***************************************************\n", error)
        return res.status(500).json(error)
    }

    res.status(200).json(data)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'POST':
            return await post(req, res)
        default:
            return res.status(400).json({ error: 'Invalid method' })
    }
}
