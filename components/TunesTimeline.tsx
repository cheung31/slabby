import {Timeline} from "./Timeline";
import { useThings } from "../hooks/useThings";

const TunesTimeline = () => {
    const { timelineData: data } = useThings('tune');

    return (
        <>
            {data && <Timeline data={data} />}
        </>
    )
}

export default TunesTimeline
