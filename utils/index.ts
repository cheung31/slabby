import { definitions } from '../types/supabase'

export function padDigits(number: number, digits: number) {
    return (
        Array(Math.max(digits - String(number).length + 1, 0)).join('0') +
        number
    )
}

export function utcStringToTimestampz(utc: string) {
    const d = new Date(parseInt(utc) * 1000)
    return `${d.getUTCFullYear()}-${padDigits(
        d.getUTCMonth() + 1,
        2
    )}-${padDigits(d.getUTCDate(), 2)}T${padDigits(
        d.getUTCHours(),
        2
    )}:${padDigits(d.getUTCMinutes(), 2)}:${padDigits(
        d.getUTCSeconds(),
        2
    )}.000Z`
}

export function groupUpserts(records: definitions['things'][]) {
    return records.reduce((acc, record) => {
        const keys: string[] = []
        for (const k in record) {
            const key = k as keyof definitions['things']
            if (record[key]) {
                keys.push(key)
            }
        }
        const groupKey = keys.join(',')
        if (!acc[groupKey]) {
            acc[groupKey] = []
        }
        acc[groupKey].push(record)

        return acc
    }, {} as Record<string, definitions['things'][]>)
}
