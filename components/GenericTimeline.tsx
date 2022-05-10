import { Timeline } from './Timeline'
import { useThings } from '../hooks/useThings'
import { ThingType } from '../types/things'
import { typeOptions } from '../config'
import { TimelineItem } from '../types/timeline'

type GenericTimelineProps = {
    type: ThingType
    initialItems?: TimelineItem[]
}
const GenericTimeline = ({ type, initialItems }: GenericTimelineProps) => {
    const { queuedSize, dequeue, onDequeueEnd, timelineData } = useThings(
        type,
        {
            ...typeOptions[type],
            initialItems,
        }
    )

    return (
        <>
            {timelineData && (
                <Timeline
                    data={timelineData}
                    queuedSize={queuedSize}
                    dequeue={dequeue}
                    onDequeueEnd={onDequeueEnd}
                />
            )}
        </>
    )
}

export default GenericTimeline
