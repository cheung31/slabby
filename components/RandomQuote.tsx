import React, {useEffect, useState } from "react"

const RandomQuote = () => {
    const [quote, setQuote] = useState("")
    const [quoteAuthor, setQuoteAuthor] = useState("")

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
        <p className="mx-auto mt-5 pl-5 pr-5 text-center text-2xl font-mono dark:text-gray-300" style={{ maxWidth: 700 }}>
            {quote}
            <br />
            <br />
            <span className="uppercase text-sm">- {quoteAuthor}</span>
        </p>
    )
}

export default RandomQuote