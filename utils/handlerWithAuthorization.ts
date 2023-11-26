import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from './supabaseClient'

type Handler<T> = (
    req: NextApiRequest,
    res: NextApiResponse<T>
) => Promise<void>
export function handlerWithAuthorization<T>(handler: Handler<T>): Handler<T> {
    return async (req, res) => {
        if (!req.headers.authorization) {
            return res.status(403).json({ error: 'Forbidden' } as unknown as T)
        }

        const { data, error } = await supabase
            .from('api_keys')
            .select('id')
            .eq('id', req.headers.authorization)
            .is('deleted_at', null)

        if (!data?.length || error) {
            return res.status(403).json({ error: 'Forbidden' } as unknown as T)
        }

        return handler(req, res)
    }
}
