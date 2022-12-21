// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../../../../utils/supabaseClient'
import { Database } from '../../../../types/database'
import { paths } from '../../../../types/api'
import { utcStringToTimestampz } from '../../../../utils'
import { isThingType } from '../../../../types/things'
import { DEFAULT_PAGE_SIZE, TYPE_PUBLISH_DELAY_MS } from '../../../../config'

type Error = {
    error: string
}
type ThingRow = Database['public']['Tables']['things']['Row']
type Data = ThingRow[] | null | PostgrestError | Error
type GetQuery = paths['/things']['get']['parameters']['query']

async function get(req: NextApiRequest, res: NextApiResponse<Data>) {
    const query = req.query as GetQuery
    const type = query.type
    if (!type || !isThingType(type)) {
        return res.status(400).json({ error: 'Missing type' })
    }

    const limit = Math.min(
        100,
        parseInt(query.limit || DEFAULT_PAGE_SIZE.toString())
    )
    const rangeFrom = parseInt(query.offset || '0')
    const rangeTo = rangeFrom + limit - 1

    const now = Date.now()
    const nowTsz = `${utcStringToTimestampz((now / 1000).toString())}`
    const contentDateOffsetTsz = `${utcStringToTimestampz(
        ((now - TYPE_PUBLISH_DELAY_MS[type]) / 1000).toString()
    )}`

    const { data, error } = await supabase
        .from('things')
        .select()
        .eq('type', type)
        .is('deleted_at', null)
        .not('image_url', 'is', null)
        .or(`posted_at.lte.${nowTsz},content_date.lte.${contentDateOffsetTsz}`)
        // TODO: ORDER BY COALESCE(posted_at, content_date) DESC
        .order('content_date', { ascending: false })
        .limit(limit)
        .range(rangeFrom, rangeTo)

    if (error) {
        console.warn(
            '***************************************************\n',
            error
        )
        return res.status(500).json(error)
    }

    res.status(200).json(
        data.sort((a, b) => {
            const aPostedAt = a.posted_at ? new Date(a.posted_at) : null
            const aContentDate = a.content_date
                ? new Date(a.content_date)
                : null
            const aDate = aPostedAt || aContentDate

            const bPostedAt = b.posted_at ? new Date(b.posted_at) : null
            const bContentDate = b.content_date
                ? new Date(b.content_date)
                : null
            const bDate = bPostedAt || bContentDate

            if (aDate === null && bDate === null) return 0

            if (aDate !== null && bDate === null) return 1

            if (aDate === null && bDate !== null) return -1

            if (aDate && bDate) {
                return bDate.getTime() - aDate.getTime()
            }

            return 0
        })
    )
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'GET':
            return await get(req, res)
        default:
            return res.status(400).json({ error: 'Invalid method' })
    }
}
