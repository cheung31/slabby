import { useMemo } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Helmet } from 'react-helmet'
import MobileNav from '../components/MobileNav'
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
            {timeline}
        </>
    )
}

export default Index
