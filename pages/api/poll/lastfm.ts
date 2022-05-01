// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from '@supabase/supabase-js'
import LastFm from '@toplast/lastfm'
import { groupUpserts, utcStringToTimestampz } from '../../../utils'
import { supabase } from '../../../utils/supabaseClient'
import { definitions } from '../../../types/supabase'
import { Data } from '../../../types/responses'
import { handlerWithAuthorization } from '../../../utils/handlerWithAuthorization'
import { typeOptions } from '../../../config'

type Response = Data<
    definitions['things'] | definitions['things'][],
    PostgrestError
>

type PostQuery = {
    user?: string
}

type GroupedRecords = {
    contentDateExcessive: definitions['things'][]
    temporary: definitions['things'][]
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

    const recentTracks = await lastFm.user.getRecentTracks({ user })
    const records = recentTracks.recenttracks.track
        .filter((track) => !!track.image)
        .filter((track) => !!track.date)
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

        const { contentDateExcessive, temporary, standard } = data.reduce(
            (acc, r) => {
                if (!r.created_at || !r.updated_at || r.deleted_at) return acc

                const now = new Date()
                const createdAt = new Date(r.created_at)
                if (
                    !r.content_date &&
                    r.external_id?.endsWith('::undefined') &&
                    now.valueOf() - createdAt.valueOf() >
                        typeOptions.tune.pollIntervalMs
                ) {
                    acc.temporary.push(r)
                }

                if (!r.content_date) return acc

                const contentDate = new Date(r.content_date)
                const updatedAt = new Date(r.updated_at)
                if (
                    createdAt.valueOf() - contentDate.valueOf() >
                    typeOptions.tune.pollIntervalMs * 7.5
                ) {
                    acc.contentDateExcessive.push(r)
                } else if (createdAt < updatedAt) {
                    acc.subsequentPoll.push(r)
                } else {
                    acc.standard.push(r)
                }
                return acc
            },
            {
                contentDateExcessive: [],
                temporary: [],
                subsequentPoll: [],
                standard: [],
            } as GroupedRecords
        )

        if (contentDateExcessive.length || temporary.length) {
            const { error: hideError } = await supabase
                .from<definitions['things']>('things')
                .update({
                    deleted_at: `${utcStringToTimestampz(
                        (Date.now() / 1000).toString()
                    )}`,
                })
                .in(
                    'id',
                    contentDateExcessive.concat(temporary).map((r) => r.id)
                )

            if (hideError) {
                errors.push(hideError)
            }
        }

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
