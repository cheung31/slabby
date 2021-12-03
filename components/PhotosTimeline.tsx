import {Timeline} from "./Timeline";
import {usePhotos} from "../hooks/usePhotos";

const PhotosTimeline = () => {
    const { timelinePhotos: data } = usePhotos();

    return (
        <>
            {data && <Timeline data={data} />}
        </>
    )
}

export default PhotosTimeline
