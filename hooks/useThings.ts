import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThingRow, ThingType } from 'types/things'
import {
    isQueuedItem,
    isVisibleItem,
    VisibleItem,
    AppearingItem,
    TimelineData,
    TimelineItem,
} from 'types/timeline'
import transformForTimeline from 'utils/transformForTimeline'
import throttle from 'utils/throttle'
import { sortThingsCompare } from 'utils/sortThings'

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
    const [isPageFocused, setIsPageFocused] = useState<boolean>(true)
    const [windowScrollY, setWindowScrollY] = useState<number | null>(null)
    const pollIntervalRef = useRef<number | null>(null)
    const [fetched, setFetched] = useState<ThingRow[]>([])
    const [timelineThings, setTimelineThings] = useState<TimelineItem[]>(
        initialItems || []
    )
    const [timelineData, setTimelineData] = useState<TimelineData | null>(null)

    const isAtTopScreen = useMemo(() => windowScrollY === 0, [windowScrollY])
    const isFocused = useMemo(
        () => isPageFocused && isAtTopScreen,
        [isPageFocused, isAtTopScreen]
    )

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
        (fetched: ThingRow[]): TimelineItem[] => {
            if (!fetched.length) return []

            const visible = timelineThings.filter((i) => isVisibleItem(i))
            const itemsLookup = timelineThings.reduce(
                (acc, i) => {
                    if (i.id) acc[i.id] = true
                    return acc
                },
                {} as Record<string, boolean>
            )

            if (!visible.length) {
                return fetched.map((i) => {
                    return { ...i, visible: true, queued: false }
                })
            }

            let enqueued = timelineThings.filter((i) => i.content_date)
            const latestItem = enqueued.length ? enqueued[0] : null

            const fetchedStale = latestItem
                ? fetched
                      .filter(
                          (i) =>
                              new Date(i.content_date ?? '').getTime() <=
                              new Date(latestItem.content_date ?? '').getTime()
                      )
                      .filter((i) => i.id && !itemsLookup[i.id])
                : []
            const fetchedNew = latestItem
                ? fetched
                      .filter(
                          (i) =>
                              new Date(i.content_date ?? '').getTime() >
                              new Date(latestItem.content_date ?? '').getTime()
                      )
                      .filter((i) => i.id && !itemsLookup[i.id])
                : []

            enqueued = enqueued
                .concat(
                    fetchedStale.map((i) => ({
                        ...i,
                        visible: true,
                        queued: false,
                    }))
                )
                .sort(sortThingsCompare)

            for (let i = fetchedNew.length - 1; i >= 0; i--) {
                enqueued.unshift({
                    ...fetchedNew[i],
                    visible: false,
                    queued: true,
                })
            }
            return enqueued
        },
        [timelineThings]
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

    useEffect(() => {
        window.scrollTo(0, 0)
        setWindowScrollY(window.scrollY)
    }, [])

    const fetchThings = useCallback(async () => {
        const response = await fetch(`/api/things/types/${type}?limit=${limit}`)
        const things = (await response.json()) as ThingRow[]
        const filtered = things.filter((t) => t.type === type)
        setFetched(filtered)
    }, [type, limit])

    useEffect(() => {
        window.scrollTo(0, 0)
        setWindowScrollY(window.scrollY)
        setFetched([])
        setTimelineThings([])
        setTimelineData([])
        if (pollIntervalRef.current) {
            window.clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
        }
    }, [type, limit])

    useEffect(() => {
        const timelineItems = enqueueFetched(fetched).filter(
            (i) => i.type === type
        )
        setTimelineThings(timelineItems)
        setTimelineData(transform(timelineItems))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetched, transform])

    useEffect(() => {
        if (isFocused && !pollIntervalRef.current) {
            ;(async () => {
                await fetchThings()
            })()
            const interval = window.setInterval(async () => {
                await fetchThings()
            }, pollIntervalMs)
            pollIntervalRef.current = interval
        } else if (!isFocused && pollIntervalRef.current) {
            window.clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
        }
    }, [isFocused, fetchThings, pollIntervalMs])

    return {
        isFocused,
        timelineData,
        queuedSize,
        dequeue,
        onDequeueEnd,
    }
}
