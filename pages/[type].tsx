import { useEffect, useState } from 'react'
import Plx from 'react-plx'
import type { NextPage } from 'next'
import {useRouter} from "next/router";
import RandomQuote from "../components/RandomQuote";
import TunesTimeline from "../components/TunesTimeline";
import PhotosTimeline from "../components/PhotosTimeline";

const Index: NextPage = () => {
    const router = useRouter()
    const { type } = router.query

    let timeline
    if (type === 'tune') {
        timeline = <TunesTimeline />
    } else {
        timeline = <PhotosTimeline />
    }

    return (
        <div className="container mx-auto">
            <div className="pt-10 pb-96">
                {timeline}
                <>
                    <Plx parallaxData={[
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
                                },                                {
                                    startValue: 0,
                                    endValue: .6,
                                    property: 'opacity',
                                },
                            ],
                        },
                    ]}>
                        <div className="mx-auto mt-5 bg-gradient-to-b from-gray-800 to-gray-300 dark:from-gray-300 dark:to-gray-800"
                             style={{width: 2, height: "75vh"}}/>
                    </Plx>
                    <Plx parallaxData={[
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
                    ]}>
                        <RandomQuote />
                    </Plx>
                </>
            </div>
        </div>
    )
}

export default Index
