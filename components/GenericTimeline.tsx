import { useThings } from '../hooks/useThings'
import { ThingType } from '../types/things'
import { typeOptions, DEBUG } from '../config'
import { TimelineItem } from '../types/timeline'
import { VirtualizedTimeline } from './VirtualizedTimeline'

type GenericTimelineProps = {
    type: ThingType
    initialItems?: TimelineItem[]
    observeVisibilityChange?: boolean
    observeFocusChange?: boolean
    debug?: boolean
}
const GenericTimeline = ({
    type,
    initialItems,
    observeVisibilityChange = true,
    observeFocusChange = true,
    debug = DEBUG,
}: GenericTimelineProps) => {
    const {
        isFocused,
        queuedSize,
        dequeue,
        onDequeueEnd,
        timelineVirtualizedData: data,
    } = useThings(
        type,
        initialItems,
        observeVisibilityChange,
        observeFocusChange,
        typeOptions[type].limit,
        typeOptions[type].pollIntervalMs,
        true,
        debug
    )

    return (
        <>
            {data && (
                <VirtualizedTimeline
                    type={type}
                    data={data}
                    queuedSize={queuedSize}
                    dequeue={dequeue}
                    onDequeueEnd={onDequeueEnd}
                    isFocused={isFocused}
                />
            )}
        </>
    )
}

export default GenericTimeline
