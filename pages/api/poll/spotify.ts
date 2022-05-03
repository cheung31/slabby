// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import puppeteer from 'puppeteer'
import { PostgrestError } from '@supabase/supabase-js'
import { Client as Spotify, createRecentlyPlayed } from 'spotify-api.js'
import { groupUpserts } from '../../../utils'
import { supabase } from '../../../utils/supabaseClient'
import { definitions } from '../../../types/supabase'
import { Data } from '../../../types/responses'
import { handlerWithAuthorization } from '../../../utils/handlerWithAuthorization'

type Response = Data<
    definitions['things'] | definitions['things'][],
    PostgrestError
>

type GroupedRecords = {
    subsequentPoll: definitions['things'][]
    standard: definitions['things'][]
}

// https://accounts.spotify.com/authorize?client_id=bd5ea46b11314ab088ae2bd23a337f8f&redirect_uri=http://localhost:3000/api/oauth/spotify_redirect&scope=user-read-recently-played&response_type=token

async function post(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (
        !process.env.SPOTIFY_ACCESS_TOKEN ||
        !process.env.SPOTIFY_CLIENT_ID ||
        !process.env.SPOTIFY_CLIENT_SECRET
    ) {
        return res.status(500).json({ error: 'Missing Spotify API Key' })
    }

    const response = await axios.get(
        `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=http://localhost:3000/api/oauth/spotify_redirect&scope=user-read-recently-played&response_type=token`
    )
    const redirectUrl = response.request.res.responseUrl
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n', {
    //     redirectUrl,
    // })

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const redirects: string[] = []
    const cdp = await page.target().createCDPSession()
    await cdp.send('Network.enable')
    await cdp.on('Network.requestWillBeSent', (e) => {
        if (e.type !== 'Document') {
            return
        }
        redirects.push(e.documentURL)
    })

    await page.goto(redirectUrl)
    await page.waitForNavigation()

    console.log(
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! final\n',
        redirects
    )
    await browser.close()

    const client = new Spotify({
        token: process.env.SPOTIFY_ACCESS_TOKEN,
    })

    const data = await client.fetch('/me/player/recently-played')
    const recentTracks = createRecentlyPlayed(client, data)

    const records = recentTracks.items.map<definitions['things']>(
        ({ track, playedAt }) => {
            const image_url = track.album?.images.sort(
                (a, b) => (b.width ?? 0) - (a.width ?? 0)
            )[0].url

            return {
                type: 'tune',
                external_source: 'Spotify',
                external_id: track.id,
                external_url: track.externalURL.spotify,
                title: track.name,
                description: track.artists[0].name,
                image_url,
                content_date: playedAt, // "2021-11-21T07:13:48.000Z"
            }
        }
    )

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
                if (
                    !r.content_date ||
                    !r.created_at ||
                    !r.updated_at ||
                    r.deleted_at
                )
                    return acc

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
