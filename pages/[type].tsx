import { useMemo } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Plx from 'react-plx'
import MobileNav from '../components/MobileNav'
import RandomQuote from '../components/RandomQuote'
import GenericTimeline from '../components/GenericTimeline'
import { isThingType, ThingType } from '../types/things'
import { TimelineItem, VisibleItem } from '../types/timeline'
import { supabase } from '../utils/supabaseClient'
import { definitions } from '../types/supabase'
import { utcStringToTimestampz } from '../utils'
import { TYPE_PUBLISH_DELAY_MS } from '../config'

type IndexProps = {
    thingType?: ThingType
    timelineItems?: TimelineItem[]
}
const Index: NextPage<IndexProps> = ({ thingType: t, timelineItems }) => {
    const router = useRouter()

    const thingType = useMemo(() => {
        const { type: queryType } = router.query
        return t || queryType
    }, [t, router])

    const timeline = isThingType(thingType) ? (
        <GenericTimeline type={thingType} initialItems={timelineItems} />
    ) : null

    return (
        <>
            <MobileNav
                className="z-50 fixed bottom-0 px-3 pb-3"
                pathname={thingType}
            />
            <div className="container mx-auto">
                <div className="pt-2 xs:pt-8" style={{ paddingBottom: '47vh' }}>
                    {timeline}
                    <>
                        <Plx
                            parallaxData={[
                                {
                                    start: 'self',
                                    duration: 700,
                                    easing: 'easeOut',
                                    properties: [
                                        {
                                            startValue: 200,
                                            endValue: 0,
                                            property: 'translateY',
                                        },
                                        {
                                            startValue: 0,
                                            endValue: 1,
                                            property: 'scale',
                                        },
                                        {
                                            startValue: 0,
                                            endValue: 0.6,
                                            property: 'opacity',
                                        },
                                    ],
                                },
                            ]}
                        >
                            <div
                                className="mx-auto mt-5 bg-gradient-to-b from-gray-800 to-gray-300 dark:from-gray-300 dark:to-gray-800"
                                style={{ width: 2, height: '75vh' }}
                            />
                        </Plx>
                        {timeline && (
                            <Plx
                                parallaxData={[
                                    {
                                        start: 'self',
                                        duration: 150,
                                        easing: 'easeOut',
                                        properties: [
                                            {
                                                startValue: 400,
                                                endValue: 0,
                                                property: 'translateY',
                                            },
                                        ],
                                    },
                                    {
                                        start: 'self',
                                        duration: 700,
                                        easing: 'easeOut',
                                        properties: [
                                            {
                                                startValue: 0,
                                                endValue: 1,
                                                property: 'opacity',
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <RandomQuote uniq={thingType} />
                            </Plx>
                        )}
                    </>
                </div>
            </div>
        </>
    )
}

export default Index

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps<{
    type?: ThingType
    timelineItems?: TimelineItem[]
}> = async ({ params }) => {
    const props = {}
    const type = params?.type
    if (!type || !isThingType(type)) return { props }

    const limit = 25
    const rangeFrom = 0
    const rangeTo = rangeFrom + limit - 1
    const contentDateOffset = `${utcStringToTimestampz(
        ((Date.now() - TYPE_PUBLISH_DELAY_MS[type]) / 1000).toString()
    )}`
    const { data: things, error } = await supabase
        .from<definitions['things']>('things')
        .select()
        .eq('type', type)
        .is('deleted_at', null)
        .not('image_url', 'is', null)
        .lte('content_date', contentDateOffset)
        .order('content_date', { ascending: false })
        .limit(limit)
        .range(rangeFrom, rangeTo)

    if (error) return { props }

    const visibleItems: VisibleItem[] = things.map((t) => ({
        ...t,
        visible: true,
        queued: false,
    }))
    return {
        props: {
            type,
            timelineItems: visibleItems,
        },
    }
}
