import React from 'react'
import { isVisibleItem, TimelineItem } from '../types/timeline'
import { LabelTag } from './LabelTag'
import BlurOverlay from './BlurOverlay'

type TimelineThingProps = {
    item: TimelineItem
    maxWidth: string | number
}
export function TimelineThing({ item, maxWidth }: TimelineThingProps) {
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
