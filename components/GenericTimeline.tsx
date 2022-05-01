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

    return (
        <>
            {data && (
                <Timeline
                    data={data}
                    queuedSize={queuedSize}
                    dequeue={dequeue}
                    onDequeueEnd={onDequeueEnd}
                />
            )}
        </>
    )
}

export default GenericTimeline
