import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { definitions } from '../types/supabase'
import { ThingType } from '../types/things'
import {
    isQueuedItem,
    isVisibleItem,
    VisibleItem,
    AppearingItem,
    TimelineData,
    TimelineItem,
} from '../types/timeline'
import transformForTimeline from '../utils/transformForTimeline'
import throttle from '../utils/throttle'

/*
# useThings

- At top of page
  - window focused
    - keep polling data
    - dequeue if queue size
  - window blurred (no-op)
    - keep polling data
    - dequeue if queue size
  - tab visible
    - keep polling data
    - dequeue if queue size
  - tab hidden
    - stop polling data
    - no dequeue
 */

export function useThings(
    type: ThingType,
    initialItems: TimelineItem[] = [],
    observeVisibilityChange: boolean,
    observeFocusChange: boolean,
    limit = 25,
    pollIntervalMs = 2 * 60 * 1000,
    debug = false
) {
    const [thingType, setThingType] = useState<ThingType>(type)
    const [isPageFocused, setIsPageFocused] = useState<boolean>(true)
    const [windowScrollY, setWindowScrollY] = useState<number | null>(null)
    const pollIntervalRef = useRef<number | null>(null)
    const [fetched, setFetched] = useState<definitions['things'][]>([])
    const [timelineThings, setTimelineThings] = useState<TimelineItem[]>(
        initialItems || []
    )
    const [timelineData, setTimelineData] = useState<TimelineData | null>(null)

    const isAtTopScreen = useMemo(() => windowScrollY === 0, [windowScrollY])
    const isFocused = useMemo(
        () => isPageFocused && isAtTopScreen,
        [isPageFocused, isAtTopScreen]
    )

    const setPollIntervalId = useCallback((intervalId: number) => {
        pollIntervalRef.current = intervalId
    }, [])

    const transform = useCallback((timelineItems: TimelineItem[]) => {
        return transformForTimeline(timelineItems)
    }, [])

    const queuedSize = useMemo(() => {
        const numQueued = timelineThings.reduce((acc, t) => {
            if (isQueuedItem(t)) acc += 1
            return acc
        }, 0)
        if (debug && numQueued > 0) console.log('######', { numQueued })
        return numQueued
    }, [timelineThings, debug])

    const dequeue = useCallback(() => {
        if (!queuedSize) return

        const things = [...timelineThings]
        things[queuedSize - 1] = {
            ...things[queuedSize - 1],
            visible: true,
            queued: true,
        }
        setTimelineThings(things)
        setTimelineData(transform(things))
    }, [queuedSize, timelineThings, transform])

    const onDequeueEnd = useCallback(
        (item: AppearingItem) => {
            const idx = timelineThings.findIndex((i) => i.id === item.id)
            const visible: VisibleItem = {
                ...timelineThings[idx],
                visible: true,
                queued: false,
            }
            timelineThings[idx] = visible
            const updatedItems = [...timelineThings]
            setTimelineThings(updatedItems)
            setTimelineData(transform(updatedItems))
        },
        [timelineThings, transform]
    )

    const enqueueFetched = useCallback(
        (fetched: definitions['things'][]): TimelineItem[] => {
            const visible = timelineThings.filter((i) => isVisibleItem(i))
            const itemsLookup = timelineThings.reduce((acc, i) => {
                if (i.id) acc[i.id] = true
                return acc
            }, {} as Record<string, boolean>)

            const fetchedFiltered = fetched.filter((t) => t.type === thingType)

            if (!visible.length) {
                return fetchedFiltered.map((i) => {
                    return { ...i, visible: true, queued: false }
                })
            }

            const enqueued = timelineThings.filter((i) => i.type === thingType)
            for (let i = fetchedFiltered.length - 1; i >= 0; i--) {
                const id = fetchedFiltered[i].id
                if (id && itemsLookup[id]) continue
                enqueued.unshift({
                    ...fetchedFiltered[i],
                    visible: false,
                    queued: true,
                })
            }
            return enqueued
        },
        [thingType, timelineThings]
    )

    const handleScrollTop = useCallback(() => {
        if (queuedSize) dequeue()
    }, [queuedSize, dequeue])

    const handleScroll = throttle(
        useCallback(() => {
            setWindowScrollY(scrollY)
            if (scrollY === 0) handleScrollTop()
        }, [handleScrollTop]),
        100
    )

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    const handleVisibilityChange = useCallback(() => {
        if (debug)
            console.log('####', {
                observeVisibilityChange,
            })
        if (!observeVisibilityChange) return
        setIsPageFocused(!document.hidden)
    }, [observeVisibilityChange, debug])

    const handleFocus = useCallback(() => {
        if (debug)
            console.log('####', {
                observeFocusChange,
                event: 'focus',
            })
        if (!observeFocusChange) return
        setIsPageFocused(true)
    }, [observeFocusChange, debug])

    useEffect(() => {
        window.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [handleVisibilityChange])

    useEffect(() => {
        window.addEventListener('focus', handleFocus)

        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [handleFocus])

    const fetchThings = useCallback(async () => {
        const response = await fetch(
            `/api/things/types/${thingType}?limit=${limit}`
        )
        const things = (await response.json()) as definitions['things'][]
        const filtered = things.filter((t) => t.type !== thingType)
        if (filtered.length && filtered[0].type !== thingType) {
            setThingType(type)
            return
        }
        setFetched(things.filter((t) => t.type === thingType))
    }, [type, thingType, limit])

    useEffect(() => {
        if (isFocused) {
            ;(async () => {
                await fetchThings()
            })()
            const interval = window.setInterval(async () => {
                await fetchThings()
            }, pollIntervalMs)
            setPollIntervalId(interval)
        } else if (!isFocused && pollIntervalRef.current) {
            window.clearInterval(pollIntervalRef.current)
        }
    }, [isFocused, fetchThings, pollIntervalMs, setPollIntervalId])

    useEffect(() => {
        const timelineItems = enqueueFetched(fetched)
        setTimelineThings(timelineItems)
        setTimelineData(transform(timelineItems))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetched, transform])

    useEffect(() => {
        if (pollIntervalRef.current) {
            window.clearInterval(pollIntervalRef.current)
        }
        setFetched([])
        setTimelineThings([])
        setTimelineData([])
    }, [thingType])

    useEffect(() => {
        setThingType(type)
    }, [type])

    useEffect(() => {
        setWindowScrollY(window.scrollY)
    }, [])

    return {
        isFocused,
        timelineData,
        queuedSize,
        dequeue,
        onDequeueEnd,
    }
}
