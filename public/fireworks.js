/* Adapted from: https://github.com/shenhuang/shenhuang.github.io/blob/master/demo_projects/fireworkdemo.html */
let embedFireworks = document.getElementById('embed--fireworks')
const numOnLoad = 3
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

function isNY() {
    const now = new Date()
    const nowMonth = now.getMonth() + 1
    const nowDate = now.getDate()
    return nowMonth === 1 && nowDate >= 1 && nowDate <= 2
}

if (isNY() && !embedFireworks) {
    const embCSS =
        '@keyframes firework-animation{0%,100%{background-color:#ff8426}25%{background-color:#fffc84}50%{background-color:#ff83f4}75%{background-color:#83b6ff}}@-webkit-keyframes firework-animation{0%,100%{background-color:#ff8426}25%{background-color:#fffc84}50%{background-color:#ff83f4}75%{background-color:#83b6ff}}@keyframes firework-seed-animation{0%,100%{background-color:#ff8426}25%{background-color:#fffc84}}@-webkit-keyframes firework-seed-animation{0%,100%{background-color:#ff8426}25%{background-color:#fffc84}}@keyframes firework-fade-animation{0%,50%{opacity:1}100%{opacity:0}}@-webkit-keyframes firework-fade-animation{0%,50%{opacity:1}100%{opacity:0}}.fireWorkBatch{z-index:999;position:absolute;top:0;left:0;animation-name:firework-fade-animation;animation-timing-function:cubic-bezier(0.5,0,1. 1);animation-duration:2.5s}.fireWorkParticle,.fireWorkSeed{z-index:999;position:absolute;height:5px;width:5px;animation-timing-function:linear;animation-iteration-count:infinite}.fireWorkParticle{border-radius:2.5px;animation-name:firework-animation;animation-duration:1s}.fireWorkSeed{border-radius:5px;animation-name:firework-seed-animation;animation-duration:.5s}'
    embedFireworks = document.createElement('div')
    embedFireworks.id = 'embed--fireworks'
    const embHTML = ''
    embedFireworks.innerHTML =
        '<style>#embed--fireworks{position:fixed;left:0;top:0;bottom:0;width:100vw;height:100vh;overflow:hidden;z-index:9999999;pointer-events:none}' +
        embCSS +
        '</style>' +
        embHTML
    document.body.appendChild(embedFireworks)

    const brd = embedFireworks
    const seeds = []
    const particles = []

    const fwkPtcIniV = 0.5
    const fwkSedIniV = 0.5
    const fwkPtcIniT = 2500
    const fwkSedIniT = 1000
    const a = 0.0005
    const g = 0.0005
    const v = 0.3
    const cursorXOffset = 5
    const cursorYOffset = 0

    function newFireworkParticle(x, y, angle) {
        let fwkPtc = document.createElement('DIV')
        fwkPtc.setAttribute('class', 'fireWorkParticle')
        fwkPtc.time = fwkPtcIniT
        while (angle > 360) angle -= 360
        while (angle < 0) angle += 360
        fwkPtc.velocity = []
        if (angle > 270) {
            fwkPtc.velocity.x =
                fwkPtcIniV *
                Math.sin((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
            fwkPtc.velocity.y =
                fwkPtcIniV *
                Math.cos((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
        } else if (angle > 180) {
            fwkPtc.velocity.x =
                fwkPtcIniV *
                Math.sin((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
            fwkPtc.velocity.y =
                fwkPtcIniV *
                Math.cos((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
        } else if (angle > 90) {
            fwkPtc.velocity.x =
                fwkPtcIniV *
                Math.sin((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
            fwkPtc.velocity.y =
                fwkPtcIniV *
                Math.cos((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
        } else {
            fwkPtc.velocity.x =
                fwkPtcIniV *
                Math.sin((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
            fwkPtc.velocity.y =
                fwkPtcIniV *
                Math.cos((angle * Math.PI) / 180) *
                (1 - Math.random() * v)
        }
        fwkPtc.position = []
        fwkPtc.position.x = x
        fwkPtc.position.y = y
        fwkPtc.style.left = fwkPtc.position.x + 'px'
        fwkPtc.style.top = fwkPtc.position.y + 'px'
        particles.push(fwkPtc)
        return fwkPtc
    }

    document.addEventListener('click', newFireWorkOnClick)

    function newFireWorkOnClick(event) {
        newFireworkSeed(
            event.pageX - brd.offsetLeft + cursorXOffset,
            event.pageY - brd.offsetTop + cursorYOffset
        )
    }

    function newFireworkSeed(x, y) {
        const fwkSed = document.createElement('div')
        fwkSed.setAttribute('class', 'fireWorkSeed')
        brd.appendChild(fwkSed)
        fwkSed.time = fwkSedIniT
        fwkSed.velocity = []
        fwkSed.velocity.x = 0
        fwkSed.velocity.y = fwkSedIniV
        fwkSed.position = []
        fwkSed.position.x = x
        fwkSed.position.y = y
        fwkSed.style.left = fwkSed.position.x + 'px'
        fwkSed.style.top = fwkSed.position.y + 'px'
        seeds.push(fwkSed)
        return fwkSed
    }

    function newFireWorkStar(x, y) {
        const fwkBch = document.createElement('DIV')
        fwkBch.setAttribute('class', 'fireWorkBatch')
        let a = 0
        while (a < 360) {
            const fwkPtc = newFireworkParticle(x, y, a)
            fwkBch.appendChild(fwkPtc)
            a += 5
        }
        brd.appendChild(fwkBch)
    }

    // Few on page load
    for (let i = 0; i < numOnLoad; i++) {
        setTimeout(() => {
            newFireworkSeed(
                windowWidth * (0.25 * (i + 1)),
                windowHeight * 0.5 * (0.5 * (i + 1))
            )
        }, 1000 * i)
    }

    let before = Date.now()
    function frame() {
        const current = Date.now()
        const deltaTime = current - before
        before = current
        for (let i in seeds) {
            const fwkSed = seeds[i]
            fwkSed.time -= deltaTime
            if (fwkSed.time > 0) {
                fwkSed.velocity.x -= fwkSed.velocity.x * a * deltaTime
                fwkSed.velocity.y -=
                    g * deltaTime + fwkSed.velocity.y * a * deltaTime
                fwkSed.position.x += fwkSed.velocity.x * deltaTime
                fwkSed.position.y -= fwkSed.velocity.y * deltaTime
                fwkSed.style.left = fwkSed.position.x + 'px'
                fwkSed.style.top = fwkSed.position.y + 'px'
            } else {
                newFireWorkStar(fwkSed.position.x, fwkSed.position.y)
                fwkSed.parentNode.removeChild(fwkSed)
                seeds.splice(i, 1)
            }
        }
        for (let i in particles) {
            const fwkPtc = particles[i]
            fwkPtc.time -= deltaTime
            if (fwkPtc.time > 0) {
                fwkPtc.velocity.x -= fwkPtc.velocity.x * a * deltaTime
                fwkPtc.velocity.y -=
                    g * deltaTime + fwkPtc.velocity.y * a * deltaTime
                fwkPtc.position.x += fwkPtc.velocity.x * deltaTime
                fwkPtc.position.y -= fwkPtc.velocity.y * deltaTime
                fwkPtc.style.left = fwkPtc.position.x + 'px'
                fwkPtc.style.top = fwkPtc.position.y + 'px'
            } else {
                fwkPtc.parentNode.removeChild(fwkPtc)
                particles.splice(i, 1)
            }
        }
        window.requestAnimationFrame(frame)
    }
    window.requestAnimationFrame(frame)
}
