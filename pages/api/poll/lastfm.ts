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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Invalid method' })
    }

    if (!process.env.LASTFM_API_KEY) {
        return res.status(500).json({ error: 'Missing LastFM API Key' })
    }

    const lastFm = new LastFm(process.env.LASTFM_API_KEY)
    const user = req.query.user ?
        Array.isArray(req.query.user) ? req.query.user[0] : req.query.user
        : 'cheung31'

    const recentTracks = await lastFm.user.getRecentTracks({ user })
    const records = recentTracks.recenttracks.track
        .map<definitions['things']>((track) => {
            return {
                type: "tune",
                external_id: `${track.mbid}::${track.date?.uts}`,
                external_url: track.url,
                title: track.name,
                description: track.artist.name,
                content_date: track.date?.uts,
            }
        })

    const { data, error } = await supabase
        .from<definitions['things']>('things')
        .upsert(records, { ignoreDuplicates: true })

    if (error) {
        return res.status(500).json(error)
    }

    res.status(200).json(data)
}
