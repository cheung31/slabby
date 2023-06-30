// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from '@supabase/supabase-js'
import { NPayload } from 'ts-foursquare/types'
import { groupUpserts, utcStringToTimestampz } from '../../../utils'
import { supabase } from '../../../utils/supabaseClient'
import IPayload = NPayload.IPayload

import { Data } from 'types/responses'
import { handlerWithAuthorization } from 'utils/handlerWithAuthorization'
import { IPhotosResponse } from 'types/foursquare'
import { ThingRow } from 'types/things'

export const PHOTO_SIZE = '1024x1024'

type Response = Data<ThingRow[] | IPayload<IPhotosResponse>, PostgrestError>

type PostQuery = {
    user_id?: string
    limit?: string
    offset?: string
}

async function post(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (
        !process.env.FOURSQUARE_USER_ID ||
        !process.env.FOURSQUARE_ACCESS_TOKEN ||
        !process.env.FOURSQUARE_CLIENT_ID ||
        !process.env.FOURSQUARE_CLIENT_SECRET
    ) {
        return res.status(500).json({ error: 'Missing Foursquare Credentials' })
    }

    let hasMorePages = true
    const query = req.query as PostQuery
    const limit = query.limit ? parseInt(query.limit) : 200
    let offset = query.offset ? parseInt(query.offset) : 0
    const errors = []
    let processed: ThingRow[] = []
    while (hasMorePages) {
        const user_id = query.user_id || process.env.FOURSQUARE_USER_ID
        let url = `https://api.foursquare.com/v2/users/${user_id}/photos?v=20210101&client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&oauth_token=${process.env.FOURSQUARE_ACCESS_TOKEN}`
        url = `${url}&offset=${offset}&limit=${limit}`

        const response = await fetch(url)
        const api_response =
            (await response.json()) as IPayload<IPhotosResponse>
        if (!api_response) {
            return res
                .status(500)
                .json({ error: 'Foursquare API request failed' })
        }

        const response_status = api_response.meta?.code || 500
        if (response_status !== 200) {
            return res.status(response_status).json(api_response)
        }

        const photos = api_response.response?.photos
        if (!photos) {
            return res.status(200).json({})
        }

        const records = photos.items.map((photo) => {
            let timestampz
            if (photo.createdAt) {
                timestampz = utcStringToTimestampz(photo.createdAt.toString())
            }

            let title
            let external_url
            if (photo.tip) {
                title = photo.tip.text
                external_url = photo.tip.canonicalUrl
            }

            let description
            if (photo.venue) {
                const { city, state, country } = photo.venue.location
                const location =
                    city && state && city !== state
                        ? `${city}, ${state}`
                        : city && country
                        ? `${city}, ${country}`
                        : city
                description = `${photo.venue.name} - ${location}`
            }

            const image_url = `${photo.prefix}${PHOTO_SIZE}${photo.suffix}`

            return {
                type: 'photo',
                external_source: 'Foursquare',
                external_id: photo.id,
                external_url,
                title,
                description,
                image_url,
                content_date: timestampz, // "2021-11-21T07:13:48.000Z"
            } as ThingRow
        })

        const groupedRecords = groupUpserts(records)

        for (const k in groupedRecords) {
            const rs = groupedRecords[k]

            const { data, error } = await supabase
                .from('things')
                .upsert(rs, {
                    onConflict: 'external_source,external_id',
                    ignoreDuplicates: true,
                })
                .select()

            if (error) {
                errors.push(error)
            }

            if (data) {
                processed = processed.concat(data)
            }
        }

        hasMorePages = offset + photos.items.length < photos.count
        if (hasMorePages) {
            offset = offset + photos.items.length
        }
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
