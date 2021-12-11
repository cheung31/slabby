// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from '../../../utils/supabaseClient'
import { definitions, paths } from "../../../types/supabase";
import { utcStringToTimestampz } from "../../../utils";
import { isThingType, ThingType } from "../../../types/things";

type Error = {
    error: string
}
type Data = definitions['things'][] | null | PostgrestError | Error
type GetPathQuery = {
    type: string
}
type GetQuery = paths["/things"]["get"]["parameters"]["query"]

const DEFAULT_PAGE_SIZE = 10
const TYPE_PUBLISH_DELAY_MS: Record<ThingType, number> = {
    'tune': 0,
    'photo': 7 * 24 * 3600 * 1000
}

async function get(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const query = req.query as GetQuery
    const type = query.type
    if (!type || !isThingType(type)) {
        return res.status(400).json({ error: 'Missing type' })
    }

    const limit = Math.min(100, parseInt(query.limit || DEFAULT_PAGE_SIZE.toString()))
    const rangeFrom = parseInt(query.offset || "0")
    const rangeTo = rangeFrom + limit - 1

    const contentDateOffset = `${utcStringToTimestampz(((Date.now() - TYPE_PUBLISH_DELAY_MS[type])/1000).toString())}`

    const {data, error} = await supabase
        .from<definitions['things']>('things')
        .select(query.select)
        .eq('type', type)
        .is("deleted_at", null)
        .lte('content_date', contentDateOffset)
        .order('content_date', {ascending: false})
        .limit(limit)
        .range(rangeFrom, rangeTo)

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
        case 'GET':
            return await get(req, res)
        default:
            return res.status(400).json({ error: 'Invalid method' })
    }
}
