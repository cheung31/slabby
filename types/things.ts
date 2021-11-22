const thingTypes = ['tune', 'photo'] as const;
export type ThingType = typeof thingTypes[number]
export function isThingType(type: unknown): type is ThingType {
    const foundKey = thingTypes.find((t) => t === type);
    return !!foundKey
}