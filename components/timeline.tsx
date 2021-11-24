import { definitions } from "../types/supabase";

type TimelineMonth = {
    year: number,
    month: number,
    items: definitions['things'][]
}
type TimelineYear = {
    year: number,
    months: TimelineMonth[]
}
type TimelineData = TimelineYear[]

const data: TimelineData = [
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
                        title: 'That one time'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho'
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
                        title: 'That one time'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho'
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
                        title: 'That one time'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho'
                    },
                    {
                        type: 'photo',
                        external_source: 'Blah',
                        title: 'That one time',
                        description: 'For real, for real tho'
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
                items: []
            }
        ]
    }
]

type PhotoThingProps = {
    item: definitions['things']
}
function PhotoThing({ item }: PhotoThingProps) {

    return (
        <div>
            <img src='https://fastly.4sqi.net/img/general/610x610/16568368_akO3fX0TSNYv4CB__G6Qe3dX56oB15Yx8bmsB8c9crw.jpg' />
            <p>{item.title}</p>
            <p>{item.description}</p>
        </div>
    )
}

export function Timeline() {
    return (
        <div>
            {data.map((ty) =>
                <div key={ty.year}>
                    <h1 className="sticky top-0">{ty.year}</h1>
                    {ty.months.map((tm) =>
                        <div key={`${tm.year}-${tm.month}`}>
                            <h2 className="sticky top-0">
                                {(new Date(tm.year, tm.month-1))
                                    .toLocaleDateString('en-us', { year:"numeric", month:"short"})}
                            </h2>
                            {tm.items.map((item, idx) =>
                                <PhotoThing item={item} key={`thing-${idx}`} />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}