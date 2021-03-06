import Core from './Core.ts'
import Event from './Event.ts'
import EventTarget from './EventTarget.ts'
import ENV from './Env.ts'

/**
 * Class to wrap audio elements.
 *
 * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
 * (Firefox and Opera play via Flash). WAVE files can be played on
 * Safari, Chrome, Firefox, and Opera. When the browser is not
 * compatible with the used codec the file will not play.
 *
 * Instances are created not via constructor but via `enchant.DOMSound.load`.
 */
export default class DOMSound extends EventTarget {
    /**
     * Sound file duration (seconds).
     */
    duration: number

    /**
     * Current playback position (seconds).
     */
    get currentTime(): number {
        return this._element ? this._element.currentTime : 0
    }

    set currentTime(time: number) {
        if (this._element) {
            this._element.currentTime = time
        }
    }

    /**
     * Volume. 0 (muted) ~ 1 (full volume)
     */
    get volume(): number {
        return this._element ? this._element.volume : 1
    }

    set volume(volume: number) {
        if (this._element) {
            this._element.volume = volume
        }
    }

    _element: HTMLMediaElement

    constructor() {
        super()
        this.duration = 0
        throw new Error(`Illegal Constructor`)
    }

    /**
     * Begin playing.
     */
    play() {
        if (this._element) {
            this._element.play()
        }
    }

    /**
     * Pause playback.
     */
    pause() {
        if (this._element) {
            this._element.pause()
        }
    }

    /**
     * Stop playing.
     */
    stop() {
        this.pause()
        this.currentTime = 0
    }

    /**
     * Create a copy of this Sound object.
     */
    clone(): DOMSound {
        // TODO improve typescript standard libraries
        let clone = Object.create(DOMSound.prototype, {
            // @ts-ignore
            _element: this._element.cloneNode(false),
            // @ts-ignore
            duration: this.duration,
        })

        EventTarget.call(clone)
        return clone
    }

    static load(src: string, type: string, callback?: (e: Event) => void, onerror?: (e: Event) => void) {
        if (type == null) {
            let ext = Core.findExt(src)
            if (ext) {
                type = 'audio/' + ext
            } else {
                type = ''
            }
        }
        type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4')
        callback = callback || function () { }
        onerror = onerror || function () { }

        let sound = new DOMSound()
        sound.addEventListener('load', callback)
        sound.addEventListener('error', onerror)
        let audio = new Audio()
        if (!ENV.SOUND_ENABLED_ON_MOBILE_SAFARI
            && ENV.VENDOR_PREFIX === 'webkit'
            && ENV.TOUCH_ENABLED) {
            window.setTimeout(function () {
                sound.dispatchEvent(new Event(Event.LOAD))
            }, 0)
        } else {
            if (audio.canPlayType(type)) {
                audio.addEventListener('canplaythrough', function canplay() {
                    sound.duration = audio.duration
                    sound.dispatchEvent(new Event(Event.LOAD))
                    audio.removeEventListener('canplaythrough', canplay)
                }, false)
                audio.src = src
                audio.load()
                audio.autoplay = false
                audio.onerror = function () {
                    let e = new Event(Event.ERROR)
                    e.message = 'Cannot load an asset: ' + audio.src
                    Core.instance.dispatchEvent(e)
                    sound.dispatchEvent(e)
                }

                sound._element = audio
            } else {
                window.setTimeout(function () {
                    sound.dispatchEvent(new Event(Event.LOAD))
                }, 0)
            }
        }
        return sound
    }
}
