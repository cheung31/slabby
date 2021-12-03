import type { NextPage } from 'next'
import {useRouter} from "next/router";
import {Timeline} from "../components/timeline";
import {usePhotos} from "../hooks/usePhotos";
import {isThingType} from "../types/things";
import {useTunes} from "../hooks/useTunes";

const Index: NextPage = () => {
    const router = useRouter()
    const { type } = router.query

    let data
    if (type === 'photo') {
        const { timelinePhotos } = usePhotos();
        data = timelinePhotos
    } else if (type === 'tune') {
        const { timelineTunes } = useTunes();
        data = timelineTunes
    }

    return (
        <div className="container mx-auto">
            {data && <Timeline data={data} />}
        </div>
    )
}

export default Index
