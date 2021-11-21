// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Error = {
    error: string
}
type Data = { access_token: string } | null | Error
type GetQuery = {
    code: string
}

const REDIRECT_URI = "http://localhost:3000/api/oauth/foursquare_redirect"

async function get(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const query = req.query as GetQuery
    const code = query.code

    const response = await fetch(
        `https://foursquare.com/oauth2/access_token?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=${code}`)

    const data = await response.json()

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
