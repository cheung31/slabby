import { useEffect, useMemo, useState } from 'react'

type Quote = {
    author: string
    quote: string
}

type UseRandomQuoteProps = {
    uniq?: string
    author?: string
    quote?: string
}

export default function useRandomQuote({
    author: a,
    quote: q,
}: UseRandomQuoteProps) {
    const [state, setState] = useState<Quote | 'loading' | null>(
        a && q ? { author: a, quote: q } : null
    )
    const quote = useMemo(() => {
        if (state !== 'loading' && state !== null) return state.quote
    }, [state])
    const author = useMemo(() => {
        if (state !== 'loading' && state !== null) return state.author
    }, [state])

    useEffect(() => {
        ;(async () => {
            if (state !== null) return
            setState('loading')
            const response = await fetch('https://api.quotable.io/random')
            const data = await response.json()
            if (response.ok) {
                setState({
                    quote: data.content,
                    author: data.author,
                })
            }
        })()
    }, [state])

    return {
        quote,
        author,
    }
}
