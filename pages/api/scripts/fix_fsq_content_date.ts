// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from '@supabase/supabase-js'
import { NPayload } from 'ts-foursquare/types'
import IPayload = NPayload.IPayload
import { Data } from 'types/responses'
import { IPhotosResponse } from 'types/foursquare'

import { utcStringToTimestampz } from 'utils'
import { supabase } from 'utils/supabaseClient'
import { handlerWithAuthorization } from 'utils/handlerWithAuthorization'

type Response = Data<string[] | IPayload<IPhotosResponse>, PostgrestError>

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
    const errors: PostgrestError[] = []
    let processed: string[] = []
    while (hasMorePages) {
        const user_id = process.env.FOURSQUARE_USER_ID
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

        const updated_ids = photos.items.map(async (photo) => {
            let timestampz
            if (photo.createdAt) {
                timestampz = utcStringToTimestampz(photo.createdAt.toString())
            }

            if (timestampz) {
                const { error } = await supabase
                    .from('things')
                    .update({ content_date: timestampz })
                    .eq('external_id', photo.id)

                if (error) {
                    errors.push(error)
                } else {
                    console.log(
                        `Updated ${photo.id} content_date to ${timestampz}`
                    )
                    return photo.id
                }
            }

            return ''
        })

        const results = await Promise.all(updated_ids)
        processed = processed.concat(results)

        hasMorePages = offset + photos.items.length < photos.count
        if (hasMorePages) {
            offset = offset + photos.items.length
        }
    }

    if (!processed.length && errors.length) {
        console.warn(
            '***************************************************\n',
            errors
        )
        return res.status(500).json(errors)
    }

    console.log(
        '*************************** COMPLETED - Processed: ',
        processed.length
    )

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
