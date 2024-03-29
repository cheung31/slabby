import { NextApiRequest, NextApiResponse } from 'next'
import { PostgrestError } from '@supabase/supabase-js'
import { paths } from 'types/api'
import { ThingRow } from 'types/things'
import { supabase } from 'utils/supabaseClient'
import { utcStringToTimestampz } from 'utils'

type Error = {
    error: string
}
type Data = ThingRow[] | null | PostgrestError | Error
type DeleteQuery = paths['/things']['delete']['parameters']['query']

async function del(req: NextApiRequest, res: NextApiResponse<Data>) {
    const query = req.query as DeleteQuery
    const id = query.id

    const { error } = await supabase
        .from('things')
        .update({
            deleted_at: `${utcStringToTimestampz(
                (Date.now() / 1000).toString()
            )}`,
        })
        .eq('id', id)

    if (error) {
        console.warn(
            '***************************************************\n',
            error
        )
        return res.status(500).json(error)
    }

    return res.status(204).json(null)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'DELETE':
            return await del(req, res)
        default:
            return res.status(400).json({ error: 'Invalid method' })
    }
}
