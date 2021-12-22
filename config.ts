import { ThingType } from './types/things'

export const DEFAULT_PAGE_SIZE = 10
export const TYPE_PUBLISH_DELAY_MS: Record<ThingType, number> = {
    'tune': 0,
    'photo': 7 * 24 * 3600 * 1000
}
