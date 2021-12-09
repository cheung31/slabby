import {Timeline} from "./Timeline";
import { useThings } from "../hooks/useThings";

const TunesTimeline = () => {
    const { timelineThings: data } = useThings('tune');

    return (
        <>
            {data && <Timeline data={data} />}
        </>
    )
}

export default TunesTimeline
