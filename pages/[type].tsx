import { useMemo } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Plx from 'react-plx'
import { Helmet } from 'react-helmet'
import MobileNav from '../components/MobileNav'
import RandomQuote from '../components/RandomQuote'
import GenericTimeline from '../components/GenericTimeline'
import { isThingType, ThingType } from '../types/things'
import { TimelineItem } from '../types/timeline'
import { typeOptions } from '../config'

type IndexProps = {
    thingType?: ThingType
    timelineItems?: TimelineItem[]
}
const Index: NextPage<IndexProps> = ({ thingType: t, timelineItems }) => {
    const router = useRouter()

    const thingType = useMemo(() => {
        const { type: queryType } = router.query
        const someType = t || queryType
        if (isThingType(someType)) {
            return someType
        }
    }, [t, router])

    const timeline = thingType ? (
        <GenericTimeline type={thingType} initialItems={timelineItems} />
    ) : (
        <div style={{ height: '100vh' }} />
    )

    if (!thingType) {
        return null
    }

    return (
        <>
            <Helmet>
                <title>{typeOptions[thingType].plural}</title>
            </Helmet>
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
