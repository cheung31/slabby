import { ThingType } from './types/things'
import { useThingsOptions } from './hooks/useThings'

export const DEFAULT_PAGE_SIZE = 10
export const TYPE_PUBLISH_DELAY_MS: Record<ThingType, number> = {
    tune: 0,
    photo: 7 * 24 * 3600 * 1000,
}

export const typeOptions: Record<ThingType, useThingsOptions> = {
    tune: {
        limit: 25,
        pollIntervalMs: 30 * 1000,
    },
    photo: {
        limit: 25,
        pollIntervalMs: 2 * 60 * 1000,
    },
}
