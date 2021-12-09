import {Timeline} from "./Timeline";
import {useThings} from "../hooks/useThings";

const PhotosTimeline = () => {
    const { queued, timelineThings: data } = useThings('photo');

    return (
        <>
            {data && <Timeline data={data} />}
        </>
    )
}

export default PhotosTimeline
