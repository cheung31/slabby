import {definitions} from "../types/supabase";
import {TimelineData, TimelineItem} from "../types/timeline";

export default function transformForTimeline(
    things: TimelineItem[],
    size: number
) {
    return things.reduce((acc, t) => {
        if (!t.content_date) return acc

        const d = new Date(t.content_date)
        const thingYear = d.getFullYear()
        const thingMonth = d.getMonth() + 1

        const yearIdx = acc.timelineData.map((y) => y.year).indexOf(thingYear)
        if (yearIdx < 0) {
            acc.timelineData.push({
                year: thingYear,
                months: [{
                    year: thingYear,
                    month: thingMonth,
                    items: [t]
                }]
            })
        } else {
            const monthIdx = acc.timelineData[yearIdx].months.map((m) => m.month).indexOf(thingMonth)
            if (monthIdx < 0) {
                acc.timelineData[yearIdx].months.push({
                    year: thingYear,
                    month: thingMonth,
                    items: [t]
                })
            } else {
                acc.timelineData[yearIdx].months[monthIdx].items.push(t)
            }
        }

        return acc
    }, {
        visibleStartIdx: null,
        visibleEndIdx: null,
        timelineData: [] as TimelineData
    } as {
        visibleStartIdx: number | null,
        visibleEndIdx: number | null,
        timelineData: TimelineData
    });
}