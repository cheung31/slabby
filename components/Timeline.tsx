import { useEffect, useMemo, useRef, useState } from 'react'
import Plx from 'react-plx'
import { LabelTag } from './LabelTag'
import BlurOverlay from './BlurOverlay'
import useWindowSize, { Size } from '../hooks/useWindowSize'
import {
    isQueuedItem,
    isAppearingItem,
    isVisibleItem,
    TimelineData,
    TimelineItem,
    AppearingItem,
} from '../types/timeline'
import { timelineLength } from '../utils/timeline'

const LOAD_INTERVAL_MS = 2500
const LOAD_INTERVAL_SIZE = 3

type ThingProps = {
    item: TimelineItem
    maxWidth: string | number
    lazyLoad?: boolean
}
function Thing({ item, maxWidth, lazyLoad = true }: ThingProps) {
    const thingRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(!lazyLoad)

    useEffect(() => {
        if (!lazyLoad) {
            setVisible(true)
            return
        }

        let lazyBackgroundObserver: IntersectionObserver
        if (lazyLoad && 'IntersectionObserver' in window && thingRef.current) {
            lazyBackgroundObserver = new IntersectionObserver(function (
                entries
            ) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setVisible(true)
                        lazyBackgroundObserver.unobserve(entry.target)
                    }
                })
            })

            lazyBackgroundObserver.observe(thingRef.current)
        }

        return () => {
            if (lazyBackgroundObserver && thingRef.current) {
                lazyBackgroundObserver.unobserve(thingRef.current)
            }
        }
    }, [lazyLoad])

    return (
        <div
            ref={thingRef}
            className={`p-1.5 pl-3 pr-3 transform transition-all ease-out delay-75 duration-1000 ${
                !isVisibleItem(item) ? 'p-0 opacity-0 scale-0' : 'scale-100'
            }`}
            style={{ maxHeight: maxWidth }}
        >
            <div className="relative p-0.5">
                <div
                    className="rounded-lg shadow-lg aspect-w-1 aspect-h-1 bg-gray-400 dark:bg-gray-600"
                    style={{
                        backgroundImage:
                            visible && item.image_url
                                ? `url(${item.image_url})`
                                : undefined,
                        backgroundSize: 'cover',
                    }}
                />
                <div className="absolute top-0 left-0 w-full aspect-w-1 aspect-h-1">
                    <div className="flex flex-col items-end justify-end">
                        <LabelTag
                            vertical="bottom"
                            horizontal="right"
                            className="relative -right-1.5 bottom-2"
                        >
                            {item.title && (
                                <div className="text-right">
                                    <BlurOverlay className="inline-block bg-opacity-60 dark:bg-opacity-40">
                                        <p className="inline-block font-mono text-md text-right pl-1.5 pr-1.5 pt-0.5 pb-0.5">
                                            {item.title}
                                        </p>
                                    </BlurOverlay>
                                </div>
                            )}
                            {item.description && (
                                <div
                                    className={`text-right ${
                                        item.title ? '' : '-mt-0.5'
                                    }`}
                                >
                                    <BlurOverlay className="inline-block bg-opacity-60 dark:bg-opacity-40">
                                        <p className="font-mono text-xs text-right uppercase p-1 pl-1.5 pr-1.5">
                                            {item.description}
                                        </p>
                                    </BlurOverlay>
                                </div>
                            )}
                        </LabelTag>
                    </div>
                </div>
            </div>
        </div>
    )
}

type TimelineProps = {
    data: TimelineData
    queuedSize: number
    dequeue: () => void
    onDequeueEnd?: (item: AppearingItem) => void
    isFocused: boolean
    animateThresholdSize?: number
    maxWidth?: string | number
}
export function Timeline({
    data,
    queuedSize,
    dequeue,
    onDequeueEnd = () => {},
    isFocused,
    animateThresholdSize = 5,
    maxWidth = '44rem',
}: TimelineProps) {
    const loadIntervalRef = useRef<number | null>(null)
    const [loadedIndex, setLoadedIndex] = useState(0)
    const length = useMemo(() => timelineLength(data), [data])
    const [dequeueTimeoutId, setDequeueTimeoutId] = useState<number | null>(
        null
    )
    const size: Size = useWindowSize()

    const { aboveFoldCount } = useMemo(() => {
        const width = size.width

        let aboveFoldCount = 1
        if (size.height && width) {
            aboveFoldCount = Math.max(1, Math.ceil(size.height / width))
        }

        setLoadedIndex(aboveFoldCount - 1)

        return {
            itemWidth: width,
            aboveFoldCount,
        }
    }, [size])

    const nonLinearIntervals = useMemo(() => {
        const nonLinearIntervals = []
        for (let y = 0; y < animateThresholdSize; y++) {
            nonLinearIntervals.push(65 * Math.pow(2, y))
        }
        return nonLinearIntervals
    }, [animateThresholdSize])

    const queuedSizeInterval = useMemo(() => {
        if (queuedSize === 0) return 1000
        if (queuedSize > animateThresholdSize) return 0
        return nonLinearIntervals[animateThresholdSize - queuedSize]
    }, [animateThresholdSize, queuedSize, nonLinearIntervals])

    useEffect(() => {
        if (!dequeueTimeoutId && isFocused && queuedSize) {
            const timeoutId = window.setTimeout(dequeue, queuedSizeInterval)
            setDequeueTimeoutId(timeoutId)
        } else if (dequeueTimeoutId && (!isFocused || !queuedSize)) {
            window.clearTimeout(dequeueTimeoutId)
        }

        return () => {
            if (dequeueTimeoutId) {
                window.clearTimeout(dequeueTimeoutId)
                setDequeueTimeoutId(null)
            }
        }
    }, [isFocused, dequeueTimeoutId, queuedSize, queuedSizeInterval, dequeue])

    useEffect(() => {
        if (!aboveFoldCount) return
        let loadedIdx = 0
        loadIntervalRef.current = window.setInterval(() => {
            loadedIdx += LOAD_INTERVAL_SIZE
            setLoadedIndex(loadedIdx)
            if (loadedIdx >= length - 1) {
                if (loadIntervalRef.current) {
                    window.clearInterval(loadIntervalRef.current)
                }
                return
            }
        }, LOAD_INTERVAL_MS)

        return () => {
            if (loadIntervalRef.current) {
                window.clearInterval(loadIntervalRef.current)
            }
        }
    }, [aboveFoldCount, length, LOAD_INTERVAL_SIZE])

    let globalIdx = -1

    return (
        <div>
            {data &&
                data.map((ty) => (
                    <div key={ty.year} className="mx-auto" style={{ maxWidth }}>
                        <h1 className="font-mono p-3 text-center text-sm dark:text-gray-300">
                            <span
                                style={{
                                    paddingLeft: '.75em',
                                    letterSpacing: '.75em',
                                }}
                            >
                                {ty.year}
                            </span>
                        </h1>
                        {ty.months.map((tm) => (
                            <div
                                className="relative"
                                key={`${tm.year}-${tm.month}`}
                            >
                                <div className="z-10 sticky top-0">
                                    <LabelTag className="top-0.5 left-1.5 font-mono text-md">
                                        <BlurOverlay className="bg-opacity-60 dark:bg-opacity-30">
                                            <span className="inline-block p-1.5">
                                                {new Date(
                                                    tm.year,
                                                    tm.month - 1
                                                ).toLocaleDateString('en-us', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                        </BlurOverlay>
                                    </LabelTag>
                                </div>
                                {tm.items.map((item) => {
                                    if (
                                        isVisibleItem(item) ||
                                        isAppearingItem(item)
                                    )
                                        globalIdx++

                                    if (isAppearingItem(item)) {
                                        onDequeueEnd(item)
                                    }

                                    if (globalIdx === 0) {
                                        return (
                                            <div
                                                key={item.id}
                                                className="transform transition-all ease-out duration-1000"
                                                style={{
                                                    maxHeight: `${
                                                        isVisibleItem(item)
                                                            ? maxWidth
                                                            : '0'
                                                    }`,
                                                }}
                                            >
                                                <Thing
                                                    item={item}
                                                    maxWidth={maxWidth}
                                                    lazyLoad={false}
                                                />
                                            </div>
                                        )
                                    }

                                    if (globalIdx < aboveFoldCount) {
                                        return (
                                            <Plx
                                                key={item.id}
                                                className={`${
                                                    isQueuedItem(item)
                                                        ? 'p-0 max-h-0 opacity-0'
                                                        : isAppearingItem(item)
                                                        ? 'opacity-0'
                                                        : ''
                                                }`}
                                                parallaxData={[
                                                    {
                                                        start: 'self',
                                                        duration:
                                                            500 *
                                                            (globalIdx /
                                                                aboveFoldCount),
                                                        easing: 'easeOut',
                                                        properties: [
                                                            {
                                                                startValue:
                                                                    0.95 -
                                                                    globalIdx *
                                                                        0.1,
                                                                endValue: 1,
                                                                property:
                                                                    'scale',
                                                            },
                                                            {
                                                                startValue:
                                                                    0.95 -
                                                                    globalIdx *
                                                                        0.1,
                                                                endValue: 1,
                                                                property:
                                                                    'opacity',
                                                            },
                                                        ],
                                                    },
                                                ]}
                                            >
                                                <Thing
                                                    item={item}
                                                    maxWidth={maxWidth}
                                                    lazyLoad={false}
                                                />
                                            </Plx>
                                        )
                                    }
                                    return (
                                        <Plx
                                            key={item.id}
                                            parallaxData={[
                                                {
                                                    start: 'self',
                                                    duration: 500,
                                                    easing: 'easeOut',
                                                    properties: [
                                                        {
                                                            startValue: 0.7,
                                                            endValue: 1,
                                                            property: 'scale',
                                                        },
                                                        {
                                                            startValue: 0.3,
                                                            endValue: 1,
                                                            property: 'opacity',
                                                        },
                                                    ],
                                                },
                                            ]}
                                        >
                                            <Thing
                                                item={item}
                                                maxWidth={maxWidth}
                                                lazyLoad={
                                                    aboveFoldCount < 0
                                                        ? true
                                                        : loadedIndex <
                                                          aboveFoldCount
                                                        ? true
                                                        : globalIdx >
                                                          loadedIndex
                                                }
                                            />
                                        </Plx>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    )
}
