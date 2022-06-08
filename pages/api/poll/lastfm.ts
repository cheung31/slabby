// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { PostgrestError } from '@supabase/supabase-js'
import LastFm from '@toplast/lastfm'
import { decode } from 'html-entities'
import { groupUpserts, utcStringToTimestampz } from '../../../utils'
import { supabase } from '../../../utils/supabaseClient'
import { definitions } from '../../../types/supabase'
import { Data } from '../../../types/responses'
import { handlerWithAuthorization } from '../../../utils/handlerWithAuthorization'

type Response = Data<
    definitions['things'] | definitions['things'][],
    PostgrestError
>

type PostQuery = {
    user?: string
}

type GroupedRecords = {
    subsequentPoll: definitions['things'][]
    standard: definitions['things'][]
}

async function post(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (!process.env.LASTFM_API_KEY) {
        return res.status(500).json({ error: 'Missing LastFM API Key' })
    }

    const lastFm = new LastFm(process.env.LASTFM_API_KEY)
    const query = req.query as PostQuery
    const user = query.user || 'cheung31'

    const profilePageResponse = await fetch(
        `https://last.fm/user/${user}/library?date_preset=LAST_7_DAYS`
    )
    const profilePageBody = decode(await profilePageResponse.text())

    const recentTracks = await lastFm.user.getRecentTracks({ user })

    const filtered = recentTracks.recenttracks.track
        .filter((track) => profilePageBody.includes(track.name))
        .filter((track) => !!track.image)
        .filter((track) => !!track.date)
    const records = filtered
        .map<definitions['things']>((track) => {
            let timestampz
            if (track.date) {
                timestampz = utcStringToTimestampz(track.date?.uts)
            }
            const image_url = track.image[3]['#text'].replace('300x300', '_')

            return {
                type: 'tune',
                external_source: 'Last.fm',
                external_id: `${track.mbid || track.name}::${track.date?.uts}`,
                external_url: track.url,
                title: track.name,
                description: track.artist['#text'],
                image_url,
                content_date: timestampz, // "2021-11-21T07:13:48.000Z"
            }
        })
        .filter((r) => {
            // content date excessive
            if (!r.content_date) return false

            const now = new Date()
            const contentDate = new Date(r.content_date)

            return now.valueOf() - contentDate.valueOf() <= 5 * 60 * 1000
        })

    const groupedRecords = groupUpserts(records)
    const errors = []
    let processed: definitions['things'][] = []

    for (const k in groupedRecords) {
        const rs = groupedRecords[k]

        const { data, error } = await supabase
            .from<definitions['things']>('things')
            .upsert(rs, {
                onConflict: 'external_source,external_id',
                ignoreDuplicates: false,
            })
            .not('deleted_at', 'is', null)

        if (error) {
            errors.push(error)
        }

        if (!data) continue

        const { standard } = data.reduce(
            (acc, r) => {
                if (!r.created_at || !r.updated_at || r.deleted_at) return acc

                if (!r.content_date) return acc

                const createdAt = new Date(r.created_at)
                const updatedAt = new Date(r.updated_at)
                if (createdAt < updatedAt) {
                    acc.subsequentPoll.push(r)
                } else {
                    acc.standard.push(r)
                }
                return acc
            },
            {
                subsequentPoll: [],
                standard: [],
            } as GroupedRecords
        )

        processed = processed.concat(standard)
    }

    if (errors.length) {
        console.warn(
            '***************************************************\n',
            errors
        )
        return res.status(500).json(errors)
    }

    res.status(200).json(processed)
}

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    switch (req.method) {
        case 'POST':
            return await post(req, res)
        default:
            return res.status(400).json({ error: 'Invalid method' })
    }
}

export default handlerWithAuthorization(handler)
