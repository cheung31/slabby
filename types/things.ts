import { Database } from './database'

export type ThingRow = Database['public']['Tables']['things']['Row']

const thingTypes = ['tune', 'photo'] as const

export type ThingType = typeof thingTypes[number]

export function isThingType(type: unknown): type is ThingType {
    const foundKey = thingTypes.find((t) => t === type)
    return !!foundKey
}
