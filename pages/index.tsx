import type { NextPage } from 'next'
import {Timeline} from "../components/Timeline";
import {usePhotos} from "../hooks/usePhotos";

const Index: NextPage = () => {
    const { timelinePhotos } = usePhotos();

    return (
        <div className="container mx-auto">
            {timelinePhotos && <Timeline data={timelinePhotos} />}
        </div>
    )
}

export default Index
