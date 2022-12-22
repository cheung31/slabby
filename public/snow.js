/* https://embed.im/snow */
const snowSize = 7
let embedimSnow = document.getElementById('embedim--snow')
let windowWidth

function isXmas() {
    const now = new Date()
    const nowMonth = now.getMonth() + 1
    const nowDate = now.getDate()
    return nowMonth === 12 && nowDate >= 15 && nowDate <= 31
}

if (isXmas() && !embedimSnow) {
    windowWidth = window.innerWidth
    function embRand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a
    }
    let embCSS = `.embedim-snow{position: absolute;width: ${snowSize}px;height: ${snowSize}px;background: white;border-radius: 50%;margin-top:-10px}`
    let embHTML = ''
    for (i = 1; i < 200; i++) {
        embHTML += '<i class="embedim-snow"></i>'
        var rndX = embRand(0, 1000000) * 0.0001,
            rndO = embRand(-100000, 100000) * 0.0001,
            rndT = (embRand(3, 8) * 10).toFixed(2),
            rndS = (embRand(0, 10000) * 0.0001).toFixed(2)
        embCSS +=
            '.embedim-snow:nth-child(' +
            i +
            '){' +
            'opacity:' +
            (embRand(1, 10000) * 0.0001).toFixed(2) +
            ';' +
            'transform:translate(' +
            rndX.toFixed(2) +
            'vw,-10px) scale(' +
            rndS +
            ');' +
            'animation:fall-' +
            i +
            ' ' +
            embRand(10, 30) +
            's -' +
            embRand(0, 30) +
            's linear infinite' +
            '}' +
            '@keyframes fall-' +
            i +
            '{' +
            rndT +
            '%{' +
            'transform:translate(' +
            (rndX + rndO).toFixed(2) +
            'vw,' +
            rndT +
            'vh) scale(' +
            rndS +
            ')' +
            '}' +
            'to{' +
            'transform:translate(' +
            (rndX + rndO / 2).toFixed(2) +
            'vw, 105vh) scale(' +
            rndS +
            ')' +
            '}' +
            '}'
    }
    embedimSnow = document.createElement('div')
    embedimSnow.id = 'embedim--snow'
    const innerHtml =
        '<style>#embedim--snow{position:fixed;left:0;top:0;bottom:0;width:100vw;height:100vh;overflow:hidden;z-index:9999999;pointer-events:none}' +
        embCSS +
        '</style>' +
        embHTML
    embedimSnow.innerHTML = innerHtml

    const resizeHandler = debounce(() => {
        if (windowWidth !== window.innerWidth) {
            embedimSnow.innerHTML = innerHtml
            windowWidth = window.innerWidth
        }
    })
    window.addEventListener('resize', resizeHandler)
    document.body.appendChild(embedimSnow)
}

function debounce(cb, delay = 250) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}
