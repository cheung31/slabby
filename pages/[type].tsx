import type { NextPage } from 'next'
import {useRouter} from "next/router";
import TunesTimeline from "../components/TunesTimeline";
import PhotosTimeline from "../components/PhotosTimeline";

const Index: NextPage = () => {
    const router = useRouter()
    const { type } = router.query

    let timeline
    if (type === 'tune') {
        timeline = <TunesTimeline />
    } else {
        timeline = <PhotosTimeline />
    }

    return (
        <div className="container mx-auto">
            {timeline}
        </div>
    )
}

export default Index
