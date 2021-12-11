import {useCallback} from "react"
import {Timeline} from "./Timeline"
import {useThings} from "../hooks/useThings"
import {ThingType} from "../types/things"

const GenericTimeline = ({ type }: { type: ThingType }) => {
    const { queuedSize, dequeue, timelineData: data } = useThings(type);

    const handleScrollTop = useCallback(() => {
        if (queuedSize) {
            dequeue()
        }
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
