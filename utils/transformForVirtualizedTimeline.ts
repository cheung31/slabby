import { TimelineItem, VirtualizedData } from '../types/timeline'

export default function transformForVirtualizedTimeline(
    things: TimelineItem[]
) {
    const transformed: Record<string, boolean> = {}
    let globalIdx = 0

    return things.reduce(
        (acc, t) => {
            if (!t.content_date) return acc

            const d = new Date(t.content_date)
            const thingYear = d.getFullYear()
            const thingMonth = d.getMonth() + 1

            if (!transformed[`year-${thingYear}`]) {
                acc.rows.push({
                    type: 'year',
                    year: thingYear,
                })
                acc.groups.push({
                    type: 'year',
                    year: thingYear,
                })
                transformed[`year-${thingYear}`] = true
            }
            if (!transformed[`month-${thingMonth}`]) {
                acc.groups.push({
                    type: 'month',
                    month: thingMonth,
                    year: thingYear,
                    count: 0,
                })
                transformed[`month-${thingMonth}`] = true
            }

            const monthRow = acc.groups.find(
                (r) =>
                    r.type === 'month' &&
                    r.year === thingYear &&
                    r.month === thingMonth
            )
            acc.rows.push({
                type: 'item',
                month: thingMonth,
                year: thingYear,
                item: t,
                globalIdx,
            })
            globalIdx += 1
            if (monthRow?.type === 'month') {
                monthRow.count += 1
            }

            return acc
        },
        { rows: [], groups: [] } as VirtualizedData
    )
}
