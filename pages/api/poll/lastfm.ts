// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from "@supabase/supabase-js";
import LastFm from '@toplast/lastfm'
import { groupUpserts, utcStringToTimestampz } from "../../../utils";
import { supabase } from '../../../utils/supabaseClient'
import { definitions } from "../../../types/supabase";

type Error = {
    error: string
}
type Data = definitions['things'][] | null | PostgrestError | PostgrestError[] | Error

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
        .filter(track => !!track.image)
        .map<definitions['things']>((track) => {
            let timestampz
            if (track.date) {
                timestampz = utcStringToTimestampz(track.date?.uts)
            }
            const image_url = track.image[3]["#text"].replace('300x300','_')

            return {
                type: "tune",
                external_source: "Last.fm",
                external_id: `${track.mbid || track.name}::${track.date?.uts}`,
                external_url: track.url,
                title: track.name,
                description: track.artist["#text"],
                image_url,
                content_date: timestampz, // "2021-11-21T07:13:48.000Z"
            }
        })

    const groupedRecords = groupUpserts(records)
    const errors = []
    let processed: definitions['things'][] = []

    for (const k in groupedRecords) {
        const rs = groupedRecords[k]

        const { data, error } = await supabase
            .from<definitions['things']>('things')
            .upsert(rs, { onConflict: 'external_source,external_id', ignoreDuplicates: true })

        if (error) {
            errors.push(error)
        }

        if (data) {
            processed = processed.concat(data)
        }
    }

    if (errors.length) {
        console.warn("***************************************************\n", errors)
        return res.status(500).json(errors)
    }

    res.status(200).json(processed)
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
