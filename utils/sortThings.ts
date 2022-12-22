import { ThingRow } from 'types/things'

export function sortThingsCompare(a: ThingRow, b: ThingRow) {
    const aPostedAt = a.posted_at ? new Date(a.posted_at) : null
    const aContentDate = a.content_date ? new Date(a.content_date) : null
    const aDate = aPostedAt || aContentDate

    const bPostedAt = b.posted_at ? new Date(b.posted_at) : null
    const bContentDate = b.content_date ? new Date(b.content_date) : null
    const bDate = bPostedAt || bContentDate

    if (aDate === null && bDate === null) return 0

    if (aDate !== null && bDate === null) return 1

    if (aDate === null && bDate !== null) return -1

    if (aDate && bDate) {
        return bDate.getTime() - aDate.getTime()
    }

    return 0
}

export default function sortThings(things: ThingRow[]) {
    return things.sort(sortThingsCompare)
}
