import React, { useEffect, useMemo, useState } from 'react'
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
import Focusable from './Focusable'

type ThingProps = {
    item: TimelineItem
    maxWidth: string | number
}
function Thing({ item, maxWidth }: ThingProps) {
    return (
        <div
            className={`p-1.5 pl-3 pr-3 transform transition-all ease-out delay-75 duration-1000 ${
                !isVisibleItem(item) ? 'p-0 opacity-0 scale-0' : 'scale-100'
            }`}
            style={{ maxHeight: maxWidth }}
        >
            <div className="relative p-0.5">
                <div
                    className="rounded-lg shadow-lg aspect-w-1 aspect-h-1 bg-gray-400 dark:bg-gray-600"
                    style={{
                        backgroundImage: `url(${item.image_url})`,
                        backgroundSize: 'cover',
                    }}
                />
                <img className="absolute hidden" src={item.image_url} />
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

    let globalIdx = -1
    const tabIndex = 0
    return (
        <div tabIndex={2}>
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
                                    ) {
                                        globalIdx++
                                        // tabIndex++
                                    }

                                    if (isAppearingItem(item)) {
                                        onDequeueEnd(item)
                                    }

                                    if (globalIdx === 0) {
                                        return (
                                            <Focusable
                                                tabIndex={tabIndex}
                                                key={item.id}
                                            >
                                                <Plx
                                                    className={`transform transition-all ease-out duration-1000`}
                                                    style={{
                                                        maxHeight: `${
                                                            isVisibleItem(item)
                                                                ? maxWidth
                                                                : '0'
                                                        }`,
                                                    }}
                                                    parallaxData={[
                                                        {
                                                            start: 'self',
                                                            duration: 0,
                                                            easing: 'easeOut',
                                                            properties: [
                                                                {
                                                                    startValue: 1,
                                                                    endValue: 1,
                                                                    property:
                                                                        'scale',
                                                                },
                                                                {
                                                                    startValue: 1,
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
                                                    />
                                                </Plx>
                                            </Focusable>
                                        )
                                    }

                                    if (globalIdx < aboveFoldCount) {
                                        return (
                                            <Focusable
                                                tabIndex={tabIndex}
                                                key={item.id}
                                            >
                                                <Plx
                                                    className={`${
                                                        isQueuedItem(item)
                                                            ? 'p-0 max-h-0 opacity-0'
                                                            : isAppearingItem(
                                                                  item
                                                              )
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
                                                    />
                                                </Plx>
                                            </Focusable>
                                        )
                                    }
                                    return (
                                        <Focusable
                                            tabIndex={tabIndex}
                                            key={item.id}
                                        >
                                            <Plx
                                                parallaxData={[
                                                    {
                                                        start: 'self',
                                                        duration: 500,
                                                        easing: 'easeOut',
                                                        properties: [
                                                            {
                                                                startValue: 0.7,
                                                                endValue: 1,
                                                                property:
                                                                    'scale',
                                                            },
                                                            {
                                                                startValue: 0.3,
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
                                                />
                                            </Plx>
                                        </Focusable>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    )
}
