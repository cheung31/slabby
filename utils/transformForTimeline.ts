import {definitions} from "../types/supabase";
import {TimelineData} from "../types/timeline";

function getVisibleCountForTimeline(timeline: TimelineData | null) {
    if (!timeline) return 0
    return timeline.reduce((acc, ty) => {
        ty.months.forEach(tm => {
            tm.items.forEach(item => {
               if (item.visible) {
                   acc++
               }
            })
        })
        return acc
    }, 0)
}

export default function transformForTimeline(
    currentTimeline: TimelineData | null,
    things: definitions['things'][],
    size: number
) {
    let visibleCount = getVisibleCountForTimeline(currentTimeline)
    return things.reduce((acc, t) => {
        if (!t.content_date) return acc

        const d = new Date(t.content_date)
        const thingYear = d.getFullYear()
        const thingMonth = d.getMonth() + 1

        const yearIndex = acc.timelineData.map((y) => y.year).indexOf(thingYear)
        const item = {
            ...t,
            visible: visibleCount < size ? true : false
        }
        if (yearIndex < 0) {
            acc.timelineData.push({
                year: thingYear,
                months: [{
                    year: thingYear,
                    month: thingMonth,
                    items: [item]
                }]
            })
            visibleCount++
        } else {
            const monthIndex = acc.timelineData[yearIndex].months.map((m) => m.month).indexOf(thingMonth)
            if (monthIndex < 0) {
                acc.timelineData[yearIndex].months.push({
                    year: thingYear,
                    month: thingMonth,
                    items: [item]
                })
                visibleCount++
            } else if (acc.timelineData[yearIndex].months[monthIndex].items.map(i => i.id).indexOf(item.id) < 0) {
                acc.timelineData[yearIndex].months[monthIndex].items.push(item)
                visibleCount++
            }
        }

        return acc
    }, {
        visibleStartIdx: 0,
        visibleEndIdx: 0,
        timelineData: currentTimeline ? [...currentTimeline] : [] as TimelineData
    });
}