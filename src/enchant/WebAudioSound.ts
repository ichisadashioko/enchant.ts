import Core from './Core'
import Event from './Event'
import EventType from './EventType'
import EventTarget from './EventTarget'

/**
 * Sound wrapper class for Web Audio API (supported on some webkit-based browsers)
 */
export default class WebAudioSound extends EventTarget {
    static audioContext: AudioContext
    static destination: AudioDestinationNode

    context: AudioContext
    src: AudioBufferSourceNode
    buffer?: AudioBuffer

    _volume: number
    _currentTime: number
    _state: number
    connectTarget: AudioDestinationNode
    _gain?: GainNode
    _startTime?: number

    constructor() {
        if (!AudioContext) {
            throw new Error('This browser does not support WebAudio API.')
        }

        super()

        if (!WebAudioSound.audioContext) {
            WebAudioSound.audioContext = new AudioContext()
            WebAudioSound.destination = WebAudioSound.audioContext.destination
        }

        this.context = WebAudioSound.audioContext
        this.src = this.context.createBufferSource()
        this._volume = 1
        this._currentTime = 0
        this._state = 0
        this.connectTarget = WebAudioSound.destination
    }

    /**
     * Begin playing.
     * @param dup If true, Object plays new sound while keeps last sound.
     */
    play(dup?: boolean) {
        if (this._state === 1 && !dup) {
            this.src.disconnect()
        }
        if (this._state !== 2) {
            this._currentTime = 0
        }
        let offset = this._currentTime
        let actx = this.context
        this.src = actx.createBufferSource()
        this._gain = actx.createGain()

        if (this.buffer === undefined) {
            throw new Error('Audio buffer is not initialized!')
        }

        this.src.buffer = this.buffer
        this._gain.gain.value = this._volume

        this.src.connect(this._gain)
        this._gain.connect(this.connectTarget)
        this.src.start(0, offset, this.buffer.duration - offset - 1.192e-7)
        this._startTime = actx.currentTime - this._currentTime
        this._state = 1
    }

    /**
     * Pause playback
     */
    pause() {
        let currentTime = this.currentTime
        if (currentTime === this.duration) {
            return
        }
        this.src.stop(0)
        this._currentTime = currentTime
        this._state = 2
    }

    /**
     * Stop playing.
     */
    stop() {
        this.src.stop(0)
        this._state = 0
    }

    /**
     * Create a copy of this Sound object.
     */
    clone() {
        let sound = new WebAudioSound()
        sound.buffer = this.buffer
        return sound
    }

    /**
     * Sound file duration (seconds).
     */
    get duration(): number {
        if (this.buffer) {
            return this.buffer.duration
        } else {
            return 0
        }
    }

    /**
     * Volume. 0 (muted) ~ 1 (full volume)
     */
    get volume(): number {
        return this._volume
    }

    set volume(volume: number) {
        volume = Math.max(0, Math.min(1, volume))
        this._volume = volume
        if (this.src) {
            if (this._gain === undefined) {
                throw new Error('The Audio has not been initialized!')
            }

            this._gain.gain.value = volume
        }
    }

    /**
     * Current playback position (seconds).
     */
    get currentTime(): number {
        if (this._startTime === undefined) {
            throw new Error('Audio has not been initialized properly!')
        }

        return Math.max(0, Math.min(this.duration, this.src.context.currentTime - this._startTime))
    }

    set currentTime(time: number) {
        this._currentTime = time
        if (this._state !== 2) {
            this.play(false)
        }
    }

    /**
     * Loads an audio file and creates WebAudioSound object.
     * @param src Path of the audio file to be loaded.
     * @param type MIME type of the audio file.
     * @param callback on load callback.
     * @param onerror on error callback.
     */
    static load(src: string, type: string, callback?: (e: Event) => void, onerror?: (e: Event) => void) {
        let canPlay = (new Audio()).canPlayType(type)
        let sound = new WebAudioSound()
        callback = callback || function () { }
        onerror = onerror || function () { }
        sound.addEventListener(EventType.LOAD, callback)
        sound.addEventListener(EventType.ERROR, onerror)
        function dispatchErrorEvent() {
            let e = new Event(EventType.ERROR)
            e.message = 'Cannot load an asset: ' + src
            Core.instance.dispatchEvent(e)
            sound.dispatchEvent(e)
        }

        let actx: AudioContext, xhr: XMLHttpRequest
        if (canPlay === 'maybe' || canPlay === 'probably') {
            actx = WebAudioSound.audioContext
            xhr = new XMLHttpRequest()
            xhr.open('GET', src, true)
            xhr.responseType = 'arraybuffer'
            xhr.onload = function () {
                actx.decodeAudioData(xhr.response, function (buffer) {
                    sound.buffer = buffer
                    sound.dispatchEvent(new Event(EventType.LOAD))
                }, dispatchErrorEvent)
            }
            xhr.onerror = dispatchErrorEvent
            xhr.send(null)
        } else {
            setTimeout(dispatchErrorEvent, 50)
        }
        return sound
    }
}