import {useCallback} from "react"
import {Timeline} from "./Timeline"
import {useThings, useThingsOptions} from "../hooks/useThings"
import {ThingType} from "../types/things"

const typeOptions: Record<ThingType, useThingsOptions> = {
    'tune': {
        limit: 25,
        pollIntervalMs: 30 * 1000
    },
    'photo': {
        limit: 25,
        pollIntervalMs: 2 * 60 * 1000
    }
}

const GenericTimeline = ({ type }: { type: ThingType }) => {
    const { queuedSize, dequeue, timelineData: data } = useThings(type, typeOptions[type]);

    const handleScrollTop = useCallback(() => {
        if (queuedSize) dequeue()
    }, [queuedSize, dequeue])

    return (
        <>
            {data &&
              <Timeline
                data={data}
                queuedSize={queuedSize}
                dequeue={dequeue}
                onScrollTop={handleScrollTop}
              />
            }
        </>
    )
}

export default GenericTimeline
