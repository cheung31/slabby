import { definitions } from "../types/supabase";
import {LabelTag} from "./labelTag";
import {usePhotos} from "../hooks/usePhotos";
import {TimelineData} from "../types/timeline";

const testData: TimelineData = [
    {
        year: 2021,
        months: [
            {
                year: 2021,
                month: 11,
                items: [
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    }
                ]
            },
            {
                year: 2021,
                month: 10,
                items: [
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    }
                ]
            },
            {
                year: 2021,
                month: 9,
                items: [
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    }
                ]
            }
        ]
    },
    {
        year: 2020,
        months: [
            {
                year: 2020,
                month: 12,
                items: [
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho',
                        image_url: 'https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg'
                    }
                ]
            }
        ]
    }
]

type PhotoThingProps = {
    item: definitions['things']
}
function PhotoThing({ item }: PhotoThingProps) {
    return (
        <div className="p-1.5 pl-3 pr-3">
            <div className="relative p-0.5">
                <div className="rounded-lg shadow-lg aspect-w-1 aspect-h-1"
                     style={{ background: `url(${item.image_url})`, backgroundSize: 'cover' }}
                />
                <img className="absolute hidden"
                     src={item.image_url}
                />
                <div className="absolute top-0 left-0 w-full aspect-w-1 aspect-h-1">
                    <div className="flex flex-col items-end justify-end">
                        <LabelTag vertical="bottom" horizontal="right" className="relative -right-1.5 bottom-2">
                            {item.title && <div className="text-right">
                                <p className="inline-block font-mono text-md text-right pl-1.5 pr-1.5 pt-0.5 pb-0.5 dark:text-gray-200 bg-white bg-opacity-25 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 backdrop-blur-xl">
                                    {item.title}
                                </p>
                            </div>}
                            {item.description &&
                              <div className="text-right">
                                <p
                                  className="inline-block font-mono text-xs text-right uppercase p-1 pl-1.5 pr-1.5 dark:text-gray-200 bg-white bg-opacity-25 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 backdrop-blur-xl ">
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

export function Timeline() {
    const { timelinePhotos: data } = usePhotos();
    return (
        <>
            {data && data.map((ty) =>
                <div key={ty.year} className="mx-auto" style={{ maxWidth: 700 }}>
                    <h1 className="font-mono p-2 dark:text-gray-300">{ty.year}</h1>
                    {ty.months.map((tm) =>
                        <div className="relative" key={`${tm.year}-${tm.month}`}>
                            <div className="absolute z-10 sticky top-0">
                                <LabelTag className="top-0.5 left-1.5 font-mono text-md p-1.5 dark:text-gray-200 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 backdrop-blur-xl">
                                    <span>
                                        {(new Date(tm.year, tm.month-1))
                                            .toLocaleDateString("en-us", { year:"numeric", month:"short"})}
                                    </span>
                                </LabelTag>
                            </div>
                            {tm.items.map((item, idx) =>
                                <PhotoThing item={item} key={`thing-${idx}`} />
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}