import Core from './Core'
import Event from './Event'

export const getTime = (function () {
    return Date.now()
})

window.addEventListener('message', function (msg) {
    try {
        let data = JSON.parse(msg.data)
        if (data.type === 'event') {
            Core.instance.dispatchEvent(new Event(data.value))
        } else if (data.type) {
            switch (data.value) {
                case 'start':
                    Core.instance.start()
                    break
                case 'pause':
                    Core.instance.pause()
                    break
                case 'resume':
                    Core.instance.resume()
                    break
                case 'tick':
                    Core.instance._tick()
                    break
                default:
                    break
            }
        }
    } catch (e) {
        // ignore
        console.error(e)
    }
}, false)
