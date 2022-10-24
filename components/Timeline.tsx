import { useEffect, useMemo, useState } from 'react'
import Plx from 'react-plx'
import { LabelTag } from './LabelTag'
import BlurOverlay from './BlurOverlay'
import { TimelineThing } from './TimelineThing'
import useWindowSize, { Size } from '../hooks/useWindowSize'
import {
    isQueuedItem,
    isAppearingItem,
    isVisibleItem,
    TimelineData,
    AppearingItem,
} from '../types/timeline'
import RandomQuote from './RandomQuote'
import useRandomQuote from '../hooks/useRandomQuote'

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
    const { quote, author } = useRandomQuote({})
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
    return (
        <>
            <div className="container mx-auto">
                <div className="pt-2 xs:pt-8">
                    {data &&
                        data.map((ty) => (
                            <div
                                key={ty.year}
                                className="mx-auto"
                                style={{ maxWidth }}
                            >
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
                                                        ).toLocaleDateString(
                                                            'en-us',
                                                            {
                                                                year: 'numeric',
                                                                month: 'short',
                                                            }
                                                        )}
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
                                                                isVisibleItem(
                                                                    item
                                                                )
                                                                    ? maxWidth
                                                                    : '0'
                                                            }`,
                                                            border: '1px solid blue',
                                                        }}
                                                    >
                                                        <TimelineThing
                                                            item={item}
                                                            maxWidth={maxWidth}
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
                                                        <TimelineThing
                                                            item={item}
                                                            maxWidth={maxWidth}
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
                                                    <TimelineThing
                                                        item={item}
                                                        maxWidth={maxWidth}
                                                    />
                                                </Plx>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>

                <Plx
                    parallaxData={[
                        {
                            start: 'self',
                            duration: 700,
                            easing: 'easeOut',
                            properties: [
                                {
                                    startValue: 200,
                                    endValue: 0,
                                    property: 'translateY',
                                },
                                {
                                    startValue: 0,
                                    endValue: 1,
                                    property: 'scale',
                                },
                                {
                                    startValue: 0,
                                    endValue: 0.6,
                                    property: 'opacity',
                                },
                            ],
                        },
                    ]}
                >
                    <div
                        className="mx-auto mt-5 bg-gradient-to-b from-gray-800 to-gray-300 dark:from-gray-300 dark:to-gray-800"
                        style={{ width: 2, height: '75vh' }}
                    />
                </Plx>
                {data && (
                    <Plx
                        parallaxData={[
                            {
                                start: 'self',
                                duration: 150,
                                easing: 'easeOut',
                                properties: [
                                    {
                                        startValue: 400,
                                        endValue: 0,
                                        property: 'translateY',
                                    },
                                ],
                            },
                            {
                                start: 'self',
                                duration: 700,
                                easing: 'easeOut',
                                properties: [
                                    {
                                        startValue: 0,
                                        endValue: 1,
                                        property: 'opacity',
                                    },
                                ],
                            },
                        ]}
                    >
                        {quote && author && (
                            <RandomQuote quote={quote} author={author} />
                        )}
                    </Plx>
                )}
            </div>
        </>
    )
}
