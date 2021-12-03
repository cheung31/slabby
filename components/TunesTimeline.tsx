import {Timeline} from "./Timeline";
import {useTunes} from "../hooks/useTunes";

const TunesTimeline = () => {
    const { timelineTunes: data } = useTunes();

    return (
        <>
            {data && <Timeline data={data} />}
        </>
    )
}

export default TunesTimeline
