import { TimelineData, TimelineItem } from '../types/timeline'

export function timelineLength(data: TimelineData) {
    return data.reduce((sum, year) => {
        return (
            sum +
            year.months.reduce((acc, month) => {
                return acc + month.items.length
            }, 0)
        )
    }, 0)
}

export function transformForTimeline(things: TimelineItem[]) {
    return things.reduce((acc, t) => {
        if (!t.content_date) return acc

        const d = new Date(t.content_date)
        const thingYear = d.getFullYear()
        const thingMonth = d.getMonth() + 1

        const yearIdx = acc.map((y) => y.year).indexOf(thingYear)
        if (yearIdx < 0) {
            acc.push({
                year: thingYear,
                months: [
                    {
                        year: thingYear,
                        month: thingMonth,
                        items: [t],
                    },
                ],
            })
        } else {
            const monthIdx = acc[yearIdx].months
                .map((m) => m.month)
                .indexOf(thingMonth)
            if (monthIdx < 0) {
                acc[yearIdx].months.push({
                    year: thingYear,
                    month: thingMonth,
                    items: [t],
                })
            } else {
                acc[yearIdx].months[monthIdx].items.push(t)
            }
        }

        return acc
    }, [] as TimelineData)
}
