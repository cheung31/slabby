import { useCallback } from 'react'
import { Timeline } from './Timeline'
import { useThings } from '../hooks/useThings'
import { ThingType } from '../types/things'
import { typeOptions } from '../config'

const GenericTimeline = ({ type }: { type: ThingType }) => {
    const {
        queuedSize,
        dequeue,
        onDequeueEnd,
        timelineData: data,
    } = useThings(type, typeOptions[type])

    const handleScrollTop = useCallback(() => {
        if (queuedSize) dequeue()
    }, [queuedSize, dequeue])

    return (
        <>
            {data && (
                <Timeline
                    data={data}
                    queuedSize={queuedSize}
                    dequeue={dequeue}
                    onDequeueEnd={onDequeueEnd}
                    onScrollTop={handleScrollTop}
                />
            )}
        </>
    )
}

export default GenericTimeline
