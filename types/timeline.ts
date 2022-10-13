import { Database } from './database'

// eslint-disable-next-line @typescript-eslint/ban-types
function hasOwnProperty<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y
): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

type ThingRow = Database['public']['Tables']['things']['Row']

function isThing(item: unknown): item is ThingRow {
    return (
        typeof item === 'object' &&
        item !== null &&
        item !== undefined &&
        hasOwnProperty(item, 'id') &&
        hasOwnProperty(item, 'title') &&
        hasOwnProperty(item, 'image_url') &&
        hasOwnProperty(item, 'type') &&
        hasOwnProperty(item, 'external_source') &&
        hasOwnProperty(item, 'content_date')
    )
}

function isTimelineItem(item: unknown): item is TimelineItem {
    return (
        isThing(item) &&
        hasOwnProperty(item, 'visible') &&
        typeof item.visible === 'boolean' &&
        hasOwnProperty(item, 'queued') &&
        typeof item.queued === 'boolean'
    )
}

export type QueuedItem = ThingRow & {
    visible: false
    queued: true
}

export function isQueuedItem(item: unknown): item is QueuedItem {
    return isTimelineItem(item) && !item.visible && item.queued
}

export type AppearingItem = ThingRow & {
    visible: true
    queued: true
}

export function isAppearingItem(item: unknown): item is AppearingItem {
    return isTimelineItem(item) && item.visible && item.queued
}

export type VisibleItem = ThingRow & {
    visible: true
    queued: false
}

export function isVisibleItem(item: unknown): item is VisibleItem {
    return isTimelineItem(item) && item.visible && !item.queued
}

export type TimelineItem = QueuedItem | AppearingItem | VisibleItem

export type TimelineMonth = {
    year: number
    month: number
    items: TimelineItem[]
}

export type TimelineYear = {
    year: number
    months: TimelineMonth[]
}

export type TimelineData = TimelineYear[]
