import { useEffect, useState } from 'react'
import Plx from 'react-plx'
import type { NextPage } from 'next'
import {useRouter} from "next/router";
import TunesTimeline from "../components/TunesTimeline";
import PhotosTimeline from "../components/PhotosTimeline";

const Index: NextPage = () => {
    const router = useRouter()
    const [quote, setQuote] = useState("")
    const [quoteAuthor, setQuoteAuthor] = useState("")
    const { type } = router.query

    let timeline
    if (type === 'tune') {
        timeline = <TunesTimeline />
    } else {
        timeline = <PhotosTimeline />
    }

    useEffect(() => {
        (async () => {
            const response = await fetch("https://api.quotable.io/random")
            const data = await response.json()
            if (response.ok) {
                setQuote(data.content)
                setQuoteAuthor(data.author)
            }
        })()
    }, [])

    return (
        <div className="container mx-auto">
            <div className="pt-10 pb-96">
                {timeline}
                {quote && quoteAuthor &&
                  <>
                    <Plx parallaxData={[
                        {
                            start: 'self',
                            duration: 500,
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
                            duration: 500,
                            easing: 'easeOut',
                            properties: [
                                {
                                    startValue: 400,
                                    endValue: 0,
                                    property: 'translateY',
                                },
                                {
                                    startValue: 0,
                                    endValue: 1,
                                    property: 'opacity',
                                },
                            ],
                        },
                    ]}>
                      <p className="mx-auto mt-5 pl-5 pr-5 text-center text-2xl font-mono dark:text-gray-300" style={{ maxWidth: 700 }}>
                          {quote}
                        <br />
                        <br />
                        - {quoteAuthor}
                      </p>
                    </Plx>
                  </>
                }
            </div>
        </div>
    )
}

export default Index
