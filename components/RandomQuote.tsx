import React from 'react'

type RandomQuoteProps = {
    quote: string
    author: string
}

const RandomQuote = ({ quote, author }: RandomQuoteProps) => {
    return (
        <p
            className="mx-auto mt-5 pl-5 pr-5 text-center text-2xl font-mono dark:text-gray-300"
            style={{ maxWidth: 700, minHeight: '50vh' }}
        >
            {quote}
            <br />
            <br />
            <span className="uppercase text-sm">- {author}</span>
        </p>
    )
}

export default RandomQuote
