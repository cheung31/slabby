import {useMemo} from "react";
import Plx from 'react-plx'
import { definitions } from "../types/supabase";
import {LabelTag} from "./LabelTag";
import useWindowSize, {Size} from "../hooks/useWindowSize";
import {TimelineData, TimelineItem } from "../types/timeline";

type ThingProps = {
    item: TimelineItem
}
function Thing({ item }: ThingProps) {
    return (
        <div className={`p-1.5 pl-3 pr-3 ${item.visible ? '' : 'hidden'}`}>
            <div className="relative p-0.5">
                <div className="rounded-lg shadow-lg aspect-w-1 aspect-h-1 bg-gray-400 dark:bg-gray-600"
                     style={{ backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover' }}
                />
                <img className="absolute hidden"
                     src={item.image_url}
                />
                <div className="absolute top-0 left-0 w-full aspect-w-1 aspect-h-1">
                    <div className="flex flex-col items-end justify-end">
                        <LabelTag vertical="bottom" horizontal="right" className="relative -right-1.5 bottom-2">
                            {item.title && <div className="text-right">
                                <p className="inline-block font-mono text-md text-right pl-1.5 pr-1.5 pt-0.5 pb-0.5 dark:text-gray-200 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 dark:backdrop-brightness-50 backdrop-blur-xl">
                                    {item.title}
                                </p>
                            </div>}
                            {item.description &&
                              <div className="text-right">
                                <p
                                  className="inline-block font-mono text-xs text-right uppercase p-1 pl-1.5 pr-1.5 dark:text-gray-200 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 dark:backdrop-brightness-50 backdrop-blur-xl ">
                                    {item.description}
                                </p>
                              </div>
                            }
                        </LabelTag>
                    </div>
                </div>
            </div>
        </div>
    )
}

type TimelineProps = {
    data: TimelineData,
    maxWidth?: number
}
export function Timeline({ data, maxWidth = 700 }: TimelineProps) {
    const size: Size = useWindowSize();

    const { aboveFoldCount } = useMemo(() => {
        let width
        if (size.width && size.width > maxWidth) width = maxWidth
        width = size.width

        let aboveFoldCount = 1
        if (size.height && width) {
            aboveFoldCount = Math.max(1, Math.ceil(size.height / width))
        }

        return {
            itemWidth: width,
            aboveFoldCount
        }
    }, [size])

    let globalIdx = -1
    return (
        <div>
            {data && data.map((ty, yearIdx) =>
                <div key={ty.year} className="mx-auto" style={{ maxWidth }}>
                    <h1 className="font-mono p-3 text-center text-sm dark:text-gray-300"
                        style={{ letterSpacing: '.75em '}}
                    >
                        {ty.year}
                    </h1>
                    {ty.months.map((tm, monthIdx) =>
                        <div className="relative" key={`${tm.year}-${tm.month}`}>
                            <div className="z-10 sticky top-0">
                                <LabelTag className="top-0.5 left-1.5 font-mono text-md p-1.5 bg-white bg-opacity-20 dark:text-gray-200 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 backdrop-blur-xl">
                                    <span>
                                        {(new Date(tm.year, tm.month-1))
                                            .toLocaleDateString("en-us", { year:"numeric", month:"short"})}
                                    </span>
                                </LabelTag>
                            </div>
                            {tm.items.map((item, idx) => {
                                globalIdx++
                                if (globalIdx === 0) {
                                    return <Thing item={item} key={`${tm.year}-${tm.month}-${idx}`}/>
                                }
                                if (globalIdx < aboveFoldCount) {
                                    return <Plx key={`${tm.year}-${tm.month}-${idx}`}
                                         parallaxData={[
                                             {
                                                 start: 'self',
                                                 duration: 500 * (globalIdx / aboveFoldCount),
                                                 easing: 'easeOut',
                                                 properties: [
                                                     {
                                                         startValue: .95 - (globalIdx * .1),
                                                         endValue: 1,
                                                         property: 'scale',
                                                     },
                                                     {
                                                         startValue: .95 - (globalIdx * .1),
                                                         endValue: 1,
                                                         property: 'opacity',
                                                     },
                                                 ],
                                             },
                                         ]}>
                                        <Thing item={item}/>
                                    </Plx>
                                }
                                return (
                                    <Plx key={`${tm.year}-${tm.month}-${idx}`}
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
                                    ]}>
                                        <Thing item={item}/>
                                    </Plx>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}