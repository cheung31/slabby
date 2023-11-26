const throttle = (fn: () => void, wait = 300) => {
    let inThrottle: boolean,
        lastFn: ReturnType<typeof setTimeout>,
        lastTime: number
    return function (this: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this,
            // eslint-disable-next-line prefer-rest-params
            args = Array.prototype.slice.call(arguments) as []
        if (!inThrottle) {
            fn.apply(context, args)
            lastTime = Date.now()
            inThrottle = true
        } else {
            clearTimeout(lastFn)
            lastFn = setTimeout(
                () => {
                    if (Date.now() - lastTime >= wait) {
                        fn.apply(context, args)
                        lastTime = Date.now()
                    }
                },
                Math.max(wait - (Date.now() - lastTime), 0)
            )
        }
    }
}

export default throttle
