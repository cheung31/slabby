// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sendgrid from '@sendgrid/mail'
import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../../../utils/supabaseClient'
import { definitions, paths } from '../../../types/supabase'
import { isThingType } from '../../../types/things'
import { utcStringToTimestampz } from '../../../utils'
import { DEFAULT_PAGE_SIZE, TYPE_PUBLISH_DELAY_MS } from '../../../config'
import { ResponseError } from '@sendgrid/helpers/classes'

type Error = {
    error: string
}
type EmailError = {
    statusCode: string | number
    message: string
}
type EmailErrors = {
    data: definitions['things'][]
    errors: EmailError[]
}
type Data =
    | definitions['things'][]
    | null
    | PostgrestError
    | PostgrestError[]
    | Error

type GetQuery = paths['/things']['get']['parameters']['query']

async function post(
    req: NextApiRequest,
    res: NextApiResponse<Data | EmailErrors>
) {
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

    const dateOffset = Date.now() - TYPE_PUBLISH_DELAY_MS[type]
    const contentDateOffset = `${utcStringToTimestampz(
        (dateOffset / 1000).toString()
    )}`

    const { data, error } = await supabase
        .from<definitions['things']>('things')
        .select(query.select)
        .eq('type', type)
        .is('deleted_at', null)
        .gt('content_date', contentDateOffset)
        .order('content_date')
        .range(rangeFrom, rangeTo)

    if (error) {
        console.warn(
            '***************************************************\n',
            error
        )
        return res.status(500).json(error)
    }

    if (!process.env.SENDGRID_API_KEY) {
        console.warn(
            '***************************************************\n',
            error
        )
        const e = { error: 'Missing Sendgrid API KEY' }
        return res.status(500).json(e)
    }

    if (!process.env.PUBLISH_REMINDER_TEMPLATE_ID) {
        console.warn(
            '***************************************************\n',
            error
        )
        const e = { error: 'Missing Sendgrid Publish Reminder Template' }
        return res.status(500).json(e)
    }

    if (!process.env.FROM_EMAIL) {
        console.warn(
            '***************************************************\n',
            error
        )
        const e = { error: 'Missing From Email' }
        return res.status(500).json(e)
    }

    if (!process.env.TO_EMAIL) {
        console.warn(
            '***************************************************\n',
            error
        )
        const e = { error: 'Missing To Email' }
        return res.status(500).json(e)
    }

    const emailErrors: EmailError[] = []
    const sentThings: definitions['things'][] = []
    if (data) {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

        for (const thing of data) {
            if (!thing.content_date) {
                continue
            }

            const contentEpoch = Date.parse(thing.content_date)
            const publishEpoch = contentEpoch + TYPE_PUBLISH_DELAY_MS[type]
            const publishDate = new Date(publishEpoch)
            const dateDiff = publishDate.getTime() - new Date().getTime()
            const daysUntilPublishCount = Math.floor(
                dateDiff / (1000 * 3600 * 24)
            )
            const daysUntilPublish = `${
                daysUntilPublishCount > 1
                    ? `in ${daysUntilPublishCount} days`
                    : daysUntilPublishCount === 1
                    ? 'tomorrow'
                    : ''
            }`
            const publishAt = publishDate.toLocaleString('en-US', {
                weekday: 'short', // long, short, narrow
                day: 'numeric', // numeric, 2-digit
                year: 'numeric', // numeric, 2-digit
                month: 'long', // numeric, 2-digit, long, short, narrow
            })

            if (daysUntilPublishCount === 0) {
                continue
            }

            const dynamicTemplateData = {
                daysUntilPublish,
                publishAt,
                cancelUrl: `https://ryancheung.com/things/${thing.id}/hide`,
                thingTitle: thing.title,
                thingDescription: thing.description,
                thingImageUrl: thing.image_url,
            }
            try {
                await sendgrid.send({
                    to: process.env.TO_EMAIL, // Your email where you'll receive emails
                    from: process.env.FROM_EMAIL, // your website email address here
                    templateId: process.env.PUBLISH_REMINDER_TEMPLATE_ID,
                    dynamicTemplateData,
                })
                sentThings.push(thing)
            } catch (error) {
                const e = error as ResponseError
                console.log('!!!', e.response.body)
                emailErrors.push(error as EmailError)
            }
        }
    }

    if (emailErrors.length) {
        return res.status(200).json({
            data: sentThings,
            errors: emailErrors.map(({ statusCode, message }) => {
                return {
                    statusCode,
                    message,
                }
            }),
        })
    }

    res.status(200).json(sentThings)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | EmailErrors>
) {
    switch (req.method) {
        case 'POST':
            return await post(req, res)
        default:
            return res.status(400).json({ error: 'Invalid method' })
    }
}
